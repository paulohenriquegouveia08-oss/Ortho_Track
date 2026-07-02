import { Platform, PermissionsAndroid } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';
import { usageApi, getToken, setToken } from './api';

const isExpoGo = Constants.executionEnvironment === 'storeClient';

const CHANNEL_ID = 'orthotrack-timer';
const NOTIFICATION_ID = 'orthotrack-active-timer';

const DAILY_GOAL = 22 * 3600;
const MINIMUM_RECOMMENDED = 18 * 3600;

let intervalId: NodeJS.Timeout | null = null;
let sessionStart = 0;
let accumulatedMs = 0;
let lastSyncTimestamp = 0;
let patientId = '';
let status: 'USING' | 'REMOVED' = 'REMOVED';
let initialized = false;
let notifeeReady = false;
let notificationActionInProgress = false;

type TimerCallback = (elapsed: number, status: 'USING' | 'REMOVED') => void;
const listeners = new Set<TimerCallback>();

function log(...args: any[]) {
  console.log('[Timer]', ...args);
}

export function getCurrentElapsedMs(): number {
  if (status === 'USING' && lastSyncTimestamp > 0) {
    return accumulatedMs + Math.max(0, Date.now() - lastSyncTimestamp);
  }
  return accumulatedMs;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? ` ${m}min` : ''}`;
  if (m > 0) return `${m}min`;
  return `${totalSeconds}s`;
}

function buildNotificationBody(isUsing: boolean, totalSeconds: number): string {
  const elapsed = formatDuration(totalSeconds);
  const progress = Math.round((totalSeconds / DAILY_GOAL) * 100);

  if (isUsing) {
    if (totalSeconds >= DAILY_GOAL) return `Em uso \u2022 ${elapsed} hoje \u2022 Meta atingida!`;
    if (totalSeconds >= MINIMUM_RECOMMENDED) return `Em uso \u2022 ${elapsed} hoje \u2022 Faltam ${formatDuration(DAILY_GOAL - totalSeconds)} para meta`;
    return `Em uso \u2022 ${elapsed} hoje \u2022 ${progress}% da meta`;
  }
  return `Alinhador removido \u2022 ${elapsed} hoje \u2022 Recoloque para continuar`;
}

async function syncNotification() {
  if (!notifeeReady) {
    log('syncNotification skipped: notifee not ready');
    return;
  }
  try {
    const totalSeconds = Math.floor(getCurrentElapsedMs() / 1000);
    const body = buildNotificationBody(status === 'USING', totalSeconds);

    await notifee.displayNotification({
      id: NOTIFICATION_ID,
      title: 'OrthoTrack',
      body,
      android: {
        channelId: CHANNEL_ID,
        asForegroundService: true,
        ongoing: true,
        pressAction: { id: 'default' },
        smallIcon: 'ic_launcher',
        actions: status === 'USING'
          ? [
              { title: 'Remover', pressAction: { id: 'remove-aligner' } },
              { title: 'Abrir app', pressAction: { id: 'open-app' } },
            ]
          : [
              { title: 'Recolocar', pressAction: { id: 'reapply-aligner' } },
              { title: 'Abrir app', pressAction: { id: 'open-app' } },
            ],
      },
    });
  } catch (err) {
    log('syncNotification error:', err);
  }
}

function startInterval() {
  if (intervalId) clearTimeout(intervalId);

  const tick = async () => {
    if (status === 'USING' && sessionStart > 0) {
      await syncNotification();
      const totalSeconds = Math.floor(getCurrentElapsedMs() / 1000);
      listeners.forEach(cb => cb(totalSeconds, status));
      intervalId = setTimeout(tick, 1000);
    }
  };

  tick();
}

async function foregroundService() {
  log('foregroundService: service started');
  return new Promise<void>(() => {
    startInterval();
  });
}

async function getTokenSafe(): Promise<string | null> {
  let token = getToken();
  if (token) return token;

  try {
    const stored = await AsyncStorage.getItem('orthotrack_token');
    if (stored) {
      setToken(stored);
      return stored;
    }
  } catch {}

  try {
    const userData = await AsyncStorage.getItem('orthotrack_user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user?.token) {
        setToken(user.token);
        return user.token;
      }
    }
  } catch {}

  return null;
}

async function getPatientIdSafe(): Promise<string | null> {
  if (patientId) return patientId;

  try {
    const pid = await AsyncStorage.getItem('orthotrack_patient_id');
    if (pid) {
      patientId = pid;
      return pid;
    }
  } catch {}

  try {
    const userData = await AsyncStorage.getItem('orthotrack_user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user?.id) {
        await AsyncStorage.setItem('orthotrack_patient_id', user.id);
        patientId = user.id;
        return user.id;
      }
    }
  } catch {}

  return null;
}

export async function handleNotificationAction(actionId: string) {
  if (actionId === 'open-app' || actionId === 'default') return;
  if (notificationActionInProgress) {
    log('[Notification] action ignored duplicate:', actionId);
    return;
  }

  notificationActionInProgress = true;
  try {
    log('[Notification][Action]', actionId);

    const token = await getTokenSafe();
    const pid = await getPatientIdSafe();

    log('[Notification][Auth]', { hasToken: !!token, hasPatientId: !!pid });

    if (!token || !pid) {
      log('[Notification][Action] missing auth data');
      return;
    }

    if (actionId === 'remove-aligner') {
      log('[Notification][RecordEvent] REMOVED');
      await usageApi.recordEvent(pid, 'REMOVED');
      log('[Notification][RecordEvent][Success]');

      const totalSeconds = Math.floor(getCurrentElapsedMs() / 1000);
      accumulatedMs = totalSeconds * 1000;
      sessionStart = 0;
      status = 'REMOVED';
      await AsyncStorage.setItem('timer_active', 'false');
      await AsyncStorage.setItem('timer_accumulated', String(accumulatedMs));
      await syncNotification();
      listeners.forEach(cb => cb(totalSeconds, 'REMOVED'));

    } else if (actionId === 'reapply-aligner') {
      log('[Notification][RecordEvent] USING');
      await usageApi.recordEvent(pid, 'USING');
      log('[Notification][RecordEvent][Success]');

      let serverUsage = 0;
      try {
        const data = await usageApi.today(pid);
        serverUsage = data.todayUsageSeconds || 0;
      } catch {}

      accumulatedMs = serverUsage * 1000;
      sessionStart = Date.now();
      status = 'USING';
      lastSyncTimestamp = Date.now();

      await AsyncStorage.setItem('timer_active', 'true');
      await AsyncStorage.setItem('timer_patient_id', pid);
      await AsyncStorage.setItem('timer_start', String(sessionStart));
      await AsyncStorage.setItem('timer_accumulated', String(accumulatedMs));
      await AsyncStorage.setItem('timer_server_accumulated', String(serverUsage));

      startInterval();
      await syncNotification();
    }

    log('[Notification][Action][Done]', actionId);
  } catch (err) {
    log('[Notification][Action][Error]', err);
  } finally {
    notificationActionInProgress = false;
  }
}

async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  try {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      log('POST_NOTIFICATIONS permission:', granted);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    log('Permission request error:', err);
    return false;
  }
}

export async function initialize() {
  if (initialized) return;
  initialized = true;

  log('initialize called, isExpoGo:', isExpoGo);
  if (isExpoGo) return;

  try {
    await requestNotificationPermission();

    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Monitoramento do alinhador',
      description: 'Acompanha o tempo de uso do alinhador e permite acoes rapidas',
      importance: AndroidImportance.HIGH,
      vibration: false,
      sound: undefined,
    });

    await notifee.registerForegroundService(foregroundService);

    notifee.onForegroundEvent(async ({ type, detail }) => {
      const actionId = detail?.pressAction?.id;
      log('[Notification][ForegroundEvent]', { type, actionId });
      if (type === EventType.ACTION_PRESS && actionId) {
        await handleNotificationAction(actionId);
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const actionId = detail?.pressAction?.id;
      log('[Notification][BackgroundEvent]', { type, actionId });
      if (type === EventType.ACTION_PRESS && actionId) {
        await handleNotificationAction(actionId);
      }
    });

    notifeeReady = true;
    log('notifee fully initialized');
  } catch (err) {
    log('initialize FAILED:', err);
    notifeeReady = false;
  }
}

export async function startBackgroundTimer(pid: string, todayAccumulated: number = 0, startTimestamp?: number) {
  log('startBackgroundTimer:', { pid, todayAccumulated });
  patientId = pid;
  accumulatedMs = todayAccumulated * 1000;
  sessionStart = startTimestamp || Date.now();
  status = 'USING';
  lastSyncTimestamp = Date.now();

  await AsyncStorage.setItem('timer_active', 'true');
  await AsyncStorage.setItem('timer_patient_id', pid);
  await AsyncStorage.setItem('timer_start', String(sessionStart));
  await AsyncStorage.setItem('timer_accumulated', String(accumulatedMs));
  await AsyncStorage.setItem('timer_server_accumulated', String(todayAccumulated));

  startInterval();
  await syncNotification();
}

export async function pauseBackgroundTimer() {
  log('pauseBackgroundTimer');
  if (intervalId) { clearTimeout(intervalId); intervalId = null; }

  const totalSeconds = Math.floor(getCurrentElapsedMs() / 1000);
  accumulatedMs = totalSeconds * 1000;
  sessionStart = 0;
  status = 'REMOVED';

  await AsyncStorage.setItem('timer_active', 'false');
  await AsyncStorage.setItem('timer_accumulated', String(accumulatedMs));

  await syncNotification();
}

export async function resumeBackgroundTimer(startTimestamp?: number) {
  log('resumeBackgroundTimer:', { startTimestamp });
  sessionStart = startTimestamp || Date.now();
  status = 'USING';

  await AsyncStorage.setItem('timer_active', 'true');
  await AsyncStorage.setItem('timer_start', String(sessionStart));

  startInterval();
  await syncNotification();
}

export async function stopBackgroundTimer() {
  log('stopBackgroundTimer');
  if (intervalId) { clearTimeout(intervalId); intervalId = null; }
  status = 'REMOVED';
  sessionStart = 0;

  await AsyncStorage.setItem('timer_active', 'false');
  try {
    await notifee.stopForegroundService();
  } catch {}
  try {
    await notifee.cancelNotification(NOTIFICATION_ID);
  } catch {}
}

export async function restoreTimerState() {
  log('restoreTimerState');

  const pid = await AsyncStorage.getItem('orthotrack_patient_id') || await AsyncStorage.getItem('timer_patient_id');
  if (!pid) {
    return { active: false, patientId: '', sessionStart: 0, elapsed: 0, serverAccumulated: 0 };
  }

  patientId = pid;

  const todayData = await usageApi.today(pid).catch(() => null);
  const serverTodaySeconds = todayData?.todayUsageSeconds || 0;
  log('[Hydrate] serverTodaySeconds:', serverTodaySeconds);
  lastSyncTimestamp = Date.now();

  await AsyncStorage.setItem('timer_server_accumulated', String(serverTodaySeconds));

  // SEMPRE verificar com o backend se existe sessão ativa
  try {
    const session = await usageApi.currentSession(pid);
    log('[Hydrate] currentSession:', session);

    if (session.active && session.sessionStart) {
      // Backend diz que sessão está ativa — sincronizar com ele
      accumulatedMs = serverTodaySeconds * 1000;
      sessionStart = session.sessionStart;
      status = 'USING';
      await AsyncStorage.setItem('timer_active', 'true');
      await AsyncStorage.setItem('timer_start', String(sessionStart));
      startInterval();
      await syncNotification();
      const totalSeconds = Math.floor(getCurrentElapsedMs() / 1000);
      log('[Hydrate] active session from server, total:', totalSeconds);
      return { active: true, patientId: pid, sessionStart, elapsed: totalSeconds, serverAccumulated: serverTodaySeconds };
    }
  } catch (err) {
    log('[Hydrate] currentSession error:', err);
  }

  // Backend diz que não há sessão ativa — garantir estado local limpo
  accumulatedMs = serverTodaySeconds * 1000;
  sessionStart = 0;
  status = 'REMOVED';
  await AsyncStorage.setItem('timer_active', 'false');

  await syncNotification();
  const totalSeconds = Math.floor(getCurrentElapsedMs() / 1000);
  log('[Hydrate] final state:', { status, accumulatedMs, totalSeconds });
  return { active: false, patientId: pid, sessionStart: 0, elapsed: totalSeconds, serverAccumulated: serverTodaySeconds };
}

export async function stopTimerOnLogout() {
  log('stopTimerOnLogout');

  const pid = patientId || await AsyncStorage.getItem('orthotrack_patient_id') || await AsyncStorage.getItem('timer_patient_id');

  if (pid && status === 'USING') {
    try {
      await usageApi.recordEvent(pid, 'REMOVED');
      log('[Logout] REMOVED event sent to backend');
    } catch (err) {
      log('[Logout] Failed to send REMOVED event:', err);
    }
  }

  if (intervalId) { clearTimeout(intervalId); intervalId = null; }
  status = 'REMOVED';
  sessionStart = 0;
  accumulatedMs = 0;
  lastSyncTimestamp = 0;
  patientId = '';

  await AsyncStorage.multiRemove([
    'timer_active', 'timer_start', 'timer_accumulated',
    'timer_server_accumulated', 'timer_patient_id',
  ]);

  try { await notifee.stopForegroundService(); } catch {}
  try { await notifee.cancelNotification(NOTIFICATION_ID); } catch {}
}

export function addTimerListener(cb: TimerCallback) {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
}
