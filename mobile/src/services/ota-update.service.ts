import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type OtaStatus =
  | 'idle'
  | 'checking'
  | 'downloading'
  | 'ready'
  | 'error'
  | 'up-to-date';

export interface OtaDiagnosticInfo {
  appVersion: string;
  runtimeVersion: string;
  channel: string;
  updateId: string;
  createdAt: string;
  isEmbedded: boolean;
  isEmergency: boolean;
  isEnabled: boolean;
  status: OtaStatus;
  lastCheckedAt?: string;
  lastError?: string;
}

type OtaListener = (info: OtaDiagnosticInfo) => void;

class OtaUpdateService {
  private status: OtaStatus = 'idle';
  private lastCheckedAt?: string;
  private lastError?: string;
  private listeners: Set<OtaListener> = new Set();
  private updateDownloaded = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const storedTime = await AsyncStorage.getItem('orthotrack_ota_last_check');
      if (storedTime) {
        this.lastCheckedAt = storedTime;
      }
    } catch {}
  }

  public subscribe(listener: OtaListener): () => void {
    this.listeners.add(listener);
    listener(this.getDiagnosticInfo());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const info = this.getDiagnosticInfo();
    this.listeners.forEach((l) => l(info));
  }

  public getDiagnosticInfo(): OtaDiagnosticInfo {
    const appVer =
      Constants.expoConfig?.version ||
      (Constants.expoConfig?.extra as any)?.version ||
      '1.0.19';

    const rtVer =
      Updates.runtimeVersion ||
      (typeof Constants.expoConfig?.runtimeVersion === 'string'
        ? Constants.expoConfig.runtimeVersion
        : '1.0.19');

    const ch = Updates.channel || 'preview';

    return {
      appVersion: appVer,
      runtimeVersion: String(rtVer),
      channel: ch,
      updateId: Updates.updateId || 'embedded-bundle',
      createdAt: Updates.createdAt ? Updates.createdAt.toISOString() : 'N/A',
      isEmbedded: Updates.isEmbeddedLaunch,
      isEmergency: Updates.isEmergencyLaunch,
      isEnabled: Updates.isEnabled,
      status: this.status,
      lastCheckedAt: this.lastCheckedAt,
      lastError: this.lastError,
    };
  }

  /**
   * Verifica e baixa atualização silenciosamente em background.
   * Não bloqueia a inicialização do app nem o fluxo do usuário.
   */
  public async checkForUpdateInBackground(): Promise<boolean> {
    if (__DEV__) {
      console.log('[OTA] Running in DEV mode, OTA update check skipped');
      this.status = 'idle';
      this.notify();
      return false;
    }

    if (!Updates.isEnabled) {
      console.log('[OTA] expo-updates is not enabled in this environment');
      this.status = 'idle';
      this.notify();
      return false;
    }

    try {
      this.status = 'checking';
      this.lastError = undefined;
      this.notify();
      console.log('[OTA] Checking for update');

      const checkResult = await Updates.checkForUpdateAsync();
      const now = new Date().toISOString();
      this.lastCheckedAt = now;
      await AsyncStorage.setItem('orthotrack_ota_last_check', now).catch(() => {});

      if (!checkResult.isAvailable) {
        console.log('[OTA] No update available');
        this.status = 'up-to-date';
        this.notify();
        return false;
      }

      console.log('[OTA] Update available');
      this.status = 'downloading';
      this.notify();
      console.log('[OTA] Downloading update');

      const fetchResult = await Updates.fetchUpdateAsync();

      if (fetchResult.isNew) {
        console.log('[OTA] Update downloaded');
        console.log('[OTA] Update ready');
        this.updateDownloaded = true;
        this.status = 'ready';
        this.notify();
        return true;
      } else {
        console.log('[OTA] No new update applied');
        this.status = 'up-to-date';
        this.notify();
        return false;
      }
    } catch (err: any) {
      const message = err?.message || 'Erro desconhecido na verificação OTA';
      console.warn('[OTA] Update check or download failed:', message);
      this.lastError = message;
      this.status = 'error';
      this.notify();
      return false;
    }
  }

  /**
   * Aplica a atualização se houver uma pronta e se o momento for seguro.
   * Não reinicia se o alinhador estiver em uso ativo ou se houver operação pendente.
   */
  public async applyUpdateIfSafe(force = false): Promise<boolean> {
    if (!this.updateDownloaded && this.status !== 'ready') {
      console.log('[OTA] No ready update to apply');
      return false;
    }

    // Verificar se o cronômetro está rodando em segundo plano
    try {
      const timerActive = await AsyncStorage.getItem('timer_active');
      if (timerActive === 'true' && !force) {
        console.log('[OTA] Postponing update: user timer is currently active');
        return false;
      }
    } catch {}

    try {
      console.log('[OTA] Applying update now');
      await Updates.reloadAsync();
      return true;
    } catch (err: any) {
      console.error('[OTA] Update application failed:', err?.message);
      this.lastError = err?.message;
      this.status = 'error';
      this.notify();
      return false;
    }
  }

  public isReady(): boolean {
    return this.updateDownloaded || this.status === 'ready';
  }
}

export const otaService = new OtaUpdateService();
