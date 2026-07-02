import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, AppState, AppStateStatus, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { usageApi } from '../../src/services/api';
import { formatTimer, formatSeconds } from '../../src/utils/formatTime';
import { startBackgroundTimer, pauseBackgroundTimer, restoreTimerState, addTimerListener, getCurrentElapsedMs } from '../../src/services/timer-service';
import ConfirmActionModal from '../../src/components/ConfirmActionModal';

const DAILY_GOAL = 22 * 3600;
const MINIMUM_RECOMMENDED = 18 * 3600;

export default function InicioScreen() {
  const [status, setStatus] = useState<'USING' | 'REMOVED'>('REMOVED');
  const [serverTodaySeconds, setServerTodaySeconds] = useState(0);
  const [activeSessionSeconds, setActiveSessionSeconds] = useState(0);
  const [patientId, setPatientId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState<string>('Baixo');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'USING' | 'REMOVED' | null>(null);
  const sessionStartRef = useRef(0);

  const loadToday = useCallback(async (pid: string) => {
    try {
      const data = await usageApi.today(pid);
      setStatus(data.currentStatus);
      setServerTodaySeconds(data.todayUsageSeconds);
    } catch {}
  }, []);

  const loadRisk = useCallback(async (pid: string) => {
    try {
      const report = await usageApi.report(pid);
      if (report?.risk) setRisk(report.risk);
    } catch {}
  }, []);

  useEffect(() => {
    (async () => {
      const userData = await AsyncStorage.getItem('orthotrack_user');
      if (!userData) return;
      const user = JSON.parse(userData);
      const pid = user.id;
      setPatientId(pid);
      await AsyncStorage.setItem('orthotrack_patient_id', pid);

      const timerState = await restoreTimerState();
      if (timerState.active) {
        sessionStartRef.current = timerState.sessionStart;
        setStatus('USING');
        setActiveSessionSeconds(Math.floor((Date.now() - timerState.sessionStart) / 1000));
      }
      setServerTodaySeconds(timerState.serverAccumulated);
      await loadRisk(pid);
    })();
  }, [loadRisk]);

  useEffect(() => {
    return addTimerListener((elapsed, s) => {
      setStatus(s);
      setActiveSessionSeconds(elapsed);
    });
  }, []);

  useEffect(() => {
    if (status === 'USING' && sessionStartRef.current > 0) {
      const interval = setInterval(() => {
        setActiveSessionSeconds(Math.floor(getCurrentElapsedMs() / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  useEffect(() => {
    const appStateRef = { current: AppState.currentState };
    const sub = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        if (patientId) {
          const timerState = await restoreTimerState();
          if (timerState.active) {
            sessionStartRef.current = timerState.sessionStart;
            setStatus('USING');
            setActiveSessionSeconds(Math.floor(getCurrentElapsedMs() / 1000));
          } else {
            sessionStartRef.current = 0;
            setStatus(timerState.serverAccumulated > 0 ? 'REMOVED' : 'REMOVED');
            setActiveSessionSeconds(0);
          }
          setServerTodaySeconds(timerState.serverAccumulated);
          loadRisk(patientId);
        }
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [patientId, loadRisk]);

  const handleAction = useCallback(() => {
    if (!patientId) return;
    const newType = status === 'USING' ? 'REMOVED' : 'USING';
    setPendingAction(newType);
    setShowConfirmModal(true);
  }, [status, patientId]);

  const executeAction = useCallback(async () => {
    if (!patientId || !pendingAction) return;
    const newType = pendingAction;
    setShowConfirmModal(false);

    setLoading(true);
    try {
      const result = await usageApi.recordEvent(patientId, newType);
      setStatus(result.currentStatus);
      const todayData = await usageApi.today(patientId);
      setServerTodaySeconds(todayData.todayUsageSeconds);

      if (newType === 'USING') {
        sessionStartRef.current = Date.now();
        await startBackgroundTimer(patientId, todayData.todayUsageSeconds, Date.now());
      } else {
        await pauseBackgroundTimer();
        setActiveSessionSeconds(0);
      }
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  }, [pendingAction, patientId]);

  const totalDisplay = status === 'USING' ? activeSessionSeconds : serverTodaySeconds;
  const progress = Math.min((totalDisplay / DAILY_GOAL) * 100, 100);
  const isGood = totalDisplay >= DAILY_GOAL;
  const isWarning = totalDisplay >= MINIMUM_RECOMMENDED;
  const remaining = Math.max(DAILY_GOAL - totalDisplay, 0);

  const getRiskColor = (r: string) => {
    if (r === 'Baixo') return colors.success;
    if (r === 'Medio') return colors.warning;
    return colors.danger;
  };

  const getProgressColor = () => {
    if (isGood) return colors.success;
    if (isWarning) return colors.warning;
    return colors.danger;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>OrthoTrack</Text>
            <View style={styles.headerChips}>
              <View style={[styles.statusChip, { backgroundColor: status === 'USING' ? colors.success : colors.danger }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.white }]} />
                <Text style={styles.chipText}>{status === 'USING' ? 'USANDO' : 'REMOVIDO'}</Text>
              </View>
              <View style={[styles.riskChip, { backgroundColor: getRiskColor(risk) }]}>
                <Text style={styles.chipText}>{risk}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* Main Timer Card */}
        <View style={styles.timerCard}>
          <Text style={styles.cardTitle}>Tempo de uso hoje</Text>

          <Text style={styles.timerValue}>{formatTimer(totalDisplay)}</Text>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: getProgressColor() }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% da meta</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.statValue}>{formatSeconds(totalDisplay)}</Text>
              <Text style={styles.statLabel}>Usado</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="flag-outline" size={20} color={colors.success} />
              <Text style={styles.statValue}>22h</Text>
              <Text style={styles.statLabel}>Meta ideal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
              <Text style={styles.statValue}>18h</Text>
              <Text style={styles.statLabel}>Mínimo</Text>
            </View>
          </View>
        </View>

        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{formatSeconds(totalDisplay)}</Text>
            <Text style={styles.metricLabel}>Usado hoje</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="pause-circle-outline" size={20} color={colors.warning} />
            </View>
            <Text style={styles.metricValue}>{formatSeconds(Math.max(0, DAILY_GOAL - totalDisplay))}</Text>
            <Text style={styles.metricLabel}>Falta para meta</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
            </View>
            <Text style={[styles.metricValue, { color: isGood ? colors.success : colors.text }]}>{Math.round(progress)}%</Text>
            <Text style={styles.metricLabel}>Aderência</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: getRiskColor(risk) + '15' }]}>
              <Ionicons name="shield-outline" size={20} color={getRiskColor(risk)} />
            </View>
            <Text style={[styles.metricValue, { color: getRiskColor(risk) }]}>{risk}</Text>
            <Text style={styles.metricLabel}>Risco</Text>
          </View>
        </View>

        {/* Feedback Card */}
        {!isGood && (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.success} />
              <Text style={styles.feedbackTitle}>Orientação</Text>
            </View>
            <Text style={styles.feedbackText}>
              {!isWarning
                ? 'Você ainda está abaixo do mínimo recomendado. Use o alinhador por mais tempo para reduzir o risco de atraso no tratamento.'
                : 'Bom progresso! Continue mantendo o uso regular para atingir a meta diária de 22 horas.'}
            </Text>
          </View>
        )}

        {/* Goal Achieved Card */}
        {isGood && (
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Ionicons name="trophy-outline" size={20} color={colors.success} />
              <Text style={styles.goalTitle}>Meta atingida!</Text>
            </View>
            <Text style={styles.goalText}>
              Parabéns! Você já atingiu a meta diária de uso. Continue com o bom trabalho!
            </Text>
          </View>
        )}

        {/* Main Action Button */}
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: status === 'USING' ? colors.danger : colors.success }, loading && styles.buttonDisabled]}
          onPress={handleAction}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons
            name={status === 'USING' ? 'pause-circle-outline' : 'play-circle-outline'}
            size={24}
            color={colors.white}
          />
          <Text style={styles.mainButtonText}>
            {loading ? 'Aguardando...' : status === 'USING' ? 'Retirar alinhador' : 'Colocar alinhador'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <ConfirmActionModal
        visible={showConfirmModal}
        title={pendingAction === 'USING' ? 'Recolocar alinhador' : 'Retirar alinhador'}
        message={
          pendingAction === 'USING'
            ? 'Deseja confirmar que o alinhador foi recolocado? O cronômetro voltará a contar o tempo de uso.'
            : 'Deseja confirmar a retirada do alinhador? O cronômetro será pausado.'
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={executeAction}
        onCancel={() => {
          setShowConfirmModal(false);
          setPendingAction(null);
        }}
        icon={pendingAction === 'USING' ? 'checkmark-circle-outline' : 'pause-circle-outline'}
        variant={pendingAction === 'USING' ? 'success' : 'danger'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerChips: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  riskChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  timerCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: spacing.md,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBg: {
    height: 10,
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.subtext,
  },
  feedbackCard: {
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  feedbackText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  goalCard: {
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  goalText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  mainButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
