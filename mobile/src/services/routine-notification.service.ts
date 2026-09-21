import { Platform } from 'react-native';
import notifee, {
  TriggerType,
  AndroidImportance,
  AndroidVisibility,
  TimestampTrigger,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PatientRoutine, RoutineItem } from '../types';

const ROUTINE_CHANNEL_ID = 'orthotrack-routine-channel';
const RETURN_NOTIFICATION_ID = 'orthotrack-return-reminder';

function log(...args: any[]) {
  console.log('[RoutineNotification]', ...args);
}

/**
 * Retorna o verbo ou complemento amigável com base no nome da refeição.
 * Ex: "Almoço" -> "almoçar", "Café da manhã" -> "tomar café", "Jantar" -> "jantar"
 */
export function getMealActionPhrase(mealName: string): string {
  const lower = mealName.toLowerCase();
  if (lower.includes('almoço') || lower.includes('almoco')) return 'almoçar';
  if (lower.includes('café') || lower.includes('cafe')) return 'tomar café';
  if (lower.includes('jantar') || lower.includes('janta')) return 'jantar';
  if (lower.includes('lanche')) return 'fazer seu lanche';
  if (lower.includes('ceia')) return 'fazer sua ceia';
  if (lower.includes('higiene') || lower.includes('escova')) return 'fazer sua higiene';
  return `sua refeição (${mealName})`;
}

/**
 * Retorna o próximo timestamp em que o horário "HH:mm" vai acontecer
 * respeitando o horário local. Se já passou há mais de 10 minutos hoje,
 * agenda para o dia seguinte.
 */
export function getNextOccurrenceTimestamp(timeStr: string): number {
  const [hoursStr, minutesStr] = timeStr.split(':');
  const targetHours = parseInt(hoursStr, 10);
  const targetMinutes = parseInt(minutesStr, 10);

  const now = new Date();
  const scheduledDate = new Date(now);
  scheduledDate.setHours(targetHours, targetMinutes, 0, 0);

  // Se o horário já passou há mais de 10 minutos hoje, agenda para amanhã
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  if (scheduledDate.getTime() < tenMinutesAgo) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  return scheduledDate.getTime();
}

/**
 * Cria o canal de alta importância para alertas de rotina
 */
export async function setupRoutineNotificationChannel(): Promise<void> {
  try {
    await notifee.createChannel({
      id: ROUTINE_CHANNEL_ID,
      name: 'Rotina Inteligente e Refeições',
      description: 'Lembretes para registrar pausas de refeições e recolocar o alinhador',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      vibration: true,
      sound: 'default',
    });
  } catch (err) {
    log('Erro ao configurar canal de rotina:', err);
  }
}

/**
 * Agenda notificações para todas as refeições ativas da rotina
 */
export async function syncRoutineNotifications(
  routine: PatientRoutine | null,
  patientName: string = 'Paciente',
  currentStatus: 'USING' | 'REMOVED' = 'USING',
): Promise<void> {
  try {
    await setupRoutineNotificationChannel();

    // 1. Cancela notificações de refeições anteriores
    const triggerIds = await notifee.getTriggerNotificationIds();
    const routineTriggerIds = triggerIds.filter((id) => id.startsWith('routine-meal-'));
    for (const id of routineTriggerIds) {
      await notifee.cancelNotification(id);
    }

    if (!routine || !routine.enabled || !routine.items || routine.items.length === 0) {
      log('Rotina desativada ou sem itens. Nenhuma notificação agendada.');
      return;
    }

    const firstName = patientName.trim().split(' ')[0] || 'Você';

    // 2. Agenda para cada item ativo
    for (const item of routine.items) {
      if (!item.enabled) continue;

      const timestamp = getNextOccurrenceTimestamp(item.startTime);
      const actionPhrase = getMealActionPhrase(item.name);

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp,
        repeatFrequency: undefined, // Notifee repete após recálculo no sync diário
      };

      const notificationId = `routine-meal-${item.id}`;
      const body = `${firstName}, você já foi ${actionPhrase}? Se sim, você pode ter esquecido de registrar no app!`;

      await notifee.createTriggerNotification(
        {
          id: notificationId,
          title: `OrthoTrack \u2022 Hora do ${item.name}`,
          body,
          data: {
            type: 'routine-meal-reminder',
            routineItemId: item.id,
            mealName: item.name,
            expectedDurationMinutes: String(item.expectedDurationMinutes),
          },
          android: {
            channelId: ROUTINE_CHANNEL_ID,
            importance: AndroidImportance.HIGH,
            pressAction: { id: 'default' },
            smallIcon: 'ic_launcher',
            actions: [
              {
                title: 'Remover Alinhador',
                pressAction: { id: 'routine-action-remove' },
              },
              {
                title: 'Já Recoloquei',
                pressAction: { id: 'routine-action-dismiss' },
              },
            ],
          },
        },
        trigger,
      );

      log(`Agendado lembrete para "${item.name}" às ${item.startTime} (id: ${notificationId})`);
    }
  } catch (err) {
    log('Erro ao sincronizar notificações da rotina:', err);
  }
}

/**
 * Disparado quando o paciente remove o alinhador:
 * Agenda o lembrete de retorno para o tempo previsto sem aparelho
 */
export async function scheduleReturnReminder(
  durationMinutes: number,
  mealName?: string,
  patientName: string = 'Paciente',
): Promise<void> {
  try {
    await setupRoutineNotificationChannel();

    // Cancela lembrete de retorno anterior se houver
    await notifee.cancelNotification(RETURN_NOTIFICATION_ID);

    if (durationMinutes <= 0) return;

    const firstName = patientName.trim().split(' ')[0] || 'Você';
    const returnTimestamp = Date.now() + durationMinutes * 60 * 1000;

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: returnTimestamp,
    };

    const mealContext = mealName ? ` para o ${mealName}` : '';
    const body = `${firstName}, sua pausa${mealContext} de ${durationMinutes} min terminou. Lembre-se de escovar os dentes e recolocar seu alinhador!`;

    await notifee.createTriggerNotification(
      {
        id: RETURN_NOTIFICATION_ID,
        title: 'OrthoTrack \u2022 Hora de recolocar o alinhador!',
        body,
        data: {
          type: 'routine-return-reminder',
          mealName: mealName || '',
          durationMinutes: String(durationMinutes),
        },
        android: {
          channelId: ROUTINE_CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
          smallIcon: 'ic_launcher',
          actions: [
            {
              title: 'Recolocar Agora',
              pressAction: { id: 'reapply-aligner' },
            },
          ],
        },
      },
      trigger,
    );

    log(`Lembrete de retorno agendado para daqui a ${durationMinutes} min`);
  } catch (err) {
    log('Erro ao agendar lembrete de retorno:', err);
  }
}

/**
 * Cancela o lembrete de retorno quando o paciente já recolocou o alinhador
 */
export async function cancelReturnReminder(): Promise<void> {
  try {
    await notifee.cancelNotification(RETURN_NOTIFICATION_ID);
    log('Lembrete de retorno cancelado (alinhador em uso)');
  } catch (err) {
    log('Erro ao cancelar lembrete de retorno:', err);
  }
}
