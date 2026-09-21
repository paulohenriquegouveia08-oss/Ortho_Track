import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineStorage, OfflineUsageEvent } from './offline-storage.service';
import { usageApi } from './api';

export type SyncState = 'idle' | 'syncing' | 'synced' | 'offline';

type SyncListener = (state: SyncState, pendingCount: number) => void;
const syncListeners = new Set<SyncListener>();

let currentState: SyncState = 'idle';
let isSyncing = false;
let retryInterval: NodeJS.Timeout | null = null;
let initialized = false;

function notifyListeners(count?: number) {
  offlineStorage.getPendingCount().then((actualCount) => {
    const finalCount = count !== undefined ? count : actualCount;
    syncListeners.forEach((cb) => cb(currentState, finalCount));
  }).catch(() => {});
}

export const offlineSync = {
  getSyncState(): SyncState {
    return currentState;
  },

  addSyncListener(listener: SyncListener) {
    syncListeners.add(listener);
    offlineStorage.getPendingCount().then((cnt) => listener(currentState, cnt));
    return () => {
      syncListeners.delete(listener);
    };
  },

  async syncPendingEvents(forcedPatientId?: string): Promise<{ success: boolean; syncedCount: number }> {
    if (isSyncing) {
      return { success: false, syncedCount: 0 };
    }

    const queue = await offlineStorage.getPendingQueue();
    if (queue.length === 0) {
      currentState = 'synced';
      notifyListeners(0);
      return { success: true, syncedCount: 0 };
    }

    const pid =
      forcedPatientId ||
      queue[0].patientId ||
      (await AsyncStorage.getItem('orthotrack_patient_id')) ||
      (await AsyncStorage.getItem('timer_patient_id'));

    if (!pid) {
      return { success: false, syncedCount: 0 };
    }

    isSyncing = true;
    currentState = 'syncing';
    notifyListeners(queue.length);

    try {
      const batchPayload = queue.map((item) => ({
        clientEventId: item.clientEventId,
        type: item.type,
        timestamp: item.timestamp,
      }));

      const res = await usageApi.syncBatch(pid, batchPayload);

      // Sincronização concluída com sucesso no servidor!
      const syncedIds = queue.map((e) => e.clientEventId);
      await offlineStorage.removeEventsFromQueue(syncedIds);

      // Atualiza o cache local com os dados frescos retornados pelo servidor
      if (res?.today) {
        await offlineStorage.setCachedToday(pid, res.today);
      }

      // Atualiza também o histórico em cache a partir do servidor se possível
      try {
        const freshHistory = await usageApi.history(pid);
        if (freshHistory && Array.isArray(freshHistory)) {
          await offlineStorage.setCachedHistory(pid, freshHistory);
        }
      } catch {}

      currentState = 'synced';
      const remainingCount = await offlineStorage.getPendingCount();
      notifyListeners(remainingCount);

      return { success: true, syncedCount: queue.length };
    } catch (err: any) {
      console.log('[OfflineSync] Falha na sincronização (aparelho offline):', err?.message || err);
      currentState = 'offline';
      await offlineStorage.markEventsStatus(
        queue.map((e) => e.clientEventId),
        'failed'
      );
      notifyListeners(queue.length);
      return { success: false, syncedCount: 0 };
    } finally {
      isSyncing = false;
    }
  },

  initializeAutoSync() {
    if (initialized) return;
    initialized = true;

    // 1. Sincroniza ao retornar do segundo plano
    AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        this.syncPendingEvents();
      }
    });

    // 2. Intervalo periódico quando houver itens pendentes na fila
    if (retryInterval) clearInterval(retryInterval);
    retryInterval = setInterval(async () => {
      const count = await offlineStorage.getPendingCount();
      if (count > 0 && !isSyncing) {
        await this.syncPendingEvents();
      }
    }, 20000);

    // Tentativa inicial
    this.syncPendingEvents();
  },
};
