import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineUsageEvent {
  clientEventId: string;
  patientId: string;
  type: 'USING' | 'REMOVED';
  timestamp: string; // ISO string
  createdAt: number;
  syncStatus: 'pending' | 'syncing' | 'failed';
  retryCount: number;
}

const QUEUE_KEY = 'orthotrack_offline_events_queue';
const CACHE_TODAY_PREFIX = 'orthotrack_cache_today_';
const CACHE_HISTORY_PREFIX = 'orthotrack_cache_history_';
const CACHE_REPORT_PREFIX = 'orthotrack_cache_report_';

export const offlineStorage = {
  // --- Fila de Eventos Offline ---
  async getPendingQueue(): Promise<OfflineUsageEvent[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  async enqueueEvent(item: {
    patientId: string;
    type: 'USING' | 'REMOVED';
    timestamp?: string;
  }): Promise<OfflineUsageEvent> {
    const queue = await this.getPendingQueue();
    const event: OfflineUsageEvent = {
      clientEventId: `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      patientId: item.patientId,
      type: item.type,
      timestamp: item.timestamp || new Date().toISOString(),
      createdAt: Date.now(),
      syncStatus: 'pending',
      retryCount: 0,
    };

    queue.push(event);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return event;
  },

  async removeEventsFromQueue(clientEventIds: string[]): Promise<void> {
    const queue = await this.getPendingQueue();
    const idSet = new Set(clientEventIds);
    const filtered = queue.filter((e) => !idSet.has(e.clientEventId));
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  },

  async markEventsStatus(
    clientEventIds: string[],
    status: 'pending' | 'syncing' | 'failed'
  ): Promise<void> {
    const queue = await this.getPendingQueue();
    const idSet = new Set(clientEventIds);
    const updated = queue.map((e) => {
      if (idSet.has(e.clientEventId)) {
        return {
          ...e,
          syncStatus: status,
          retryCount: status === 'failed' ? e.retryCount + 1 : e.retryCount,
        };
      }
      return e;
    });
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  },

  async getPendingCount(): Promise<number> {
    const queue = await this.getPendingQueue();
    return queue.length;
  },

  async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
  },

  // --- Cache Local de Dados ---
  async getCachedToday(patientId: string): Promise<any | null> {
    try {
      const raw = await AsyncStorage.getItem(`${CACHE_TODAY_PREFIX}${patientId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async setCachedToday(patientId: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`${CACHE_TODAY_PREFIX}${patientId}`, JSON.stringify(data));
    } catch {}
  },

  async getCachedHistory(patientId: string): Promise<any[] | null> {
    try {
      const raw = await AsyncStorage.getItem(`${CACHE_HISTORY_PREFIX}${patientId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async setCachedHistory(patientId: string, data: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(`${CACHE_HISTORY_PREFIX}${patientId}`, JSON.stringify(data));
    } catch {}
  },

  async getCachedReport(patientId: string): Promise<any | null> {
    try {
      const raw = await AsyncStorage.getItem(`${CACHE_REPORT_PREFIX}${patientId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async setCachedReport(patientId: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`${CACHE_REPORT_PREFIX}${patientId}`, JSON.stringify(data));
    } catch {}
  },

  // --- Atualizações Otimistas em Cache ---
  async applyOptimisticEvent(
    patientId: string,
    type: 'USING' | 'REMOVED',
    timestamp: string,
    elapsedSecondsToAdd: number = 0
  ) {
    try {
      // 1. Atualizar cache de Hoje
      const today = await this.getCachedToday(patientId);
      if (today) {
        today.currentStatus = type;
        if (elapsedSecondsToAdd > 0) {
          today.todayUsageSeconds = (today.todayUsageSeconds || 0) + elapsedSecondsToAdd;
        }
        await this.setCachedToday(patientId, today);
      }

      // 2. Atualizar cache de Histórico
      const history = (await this.getCachedHistory(patientId)) || [];
      const syntheticEvent = {
        id: `local_${Date.now()}`,
        patientId,
        type,
        timestamp,
        date: timestamp.split('T')[0],
        createdAt: timestamp,
        isLocalPending: true,
      };
      const updatedHistory = [syntheticEvent, ...history];
      await this.setCachedHistory(patientId, updatedHistory);
    } catch (err) {
      console.warn('[OfflineStorage] Error applying optimistic event:', err);
    }
  },
};
