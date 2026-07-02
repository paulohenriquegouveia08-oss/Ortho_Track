import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { usageApi } from '../../src/services/api';
import { formatSeconds } from '../../src/utils/formatTime';
import { calculateAdherence, getUsageFeedback } from '../../src/utils/calculateAdherence';

const DAILY_GOAL = 22 * 3600;
const MINIMUM_RECOMMENDED = 18 * 3600;

export default function MonitorScreen() {
  const [userName, setUserName] = useState('');
  const [today, setToday] = useState<any>(null);
  const [risk, setRisk] = useState<string>('Baixo');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const pid = await AsyncStorage.getItem('orthotrack_patient_id');
      if (pid) {
        const [todayData, reportData] = await Promise.all([
          usageApi.today(pid),
          usageApi.report(pid),
        ]);
        setToday(todayData);
        if (reportData?.risk) setRisk(reportData.risk);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('orthotrack_user').then(data => {
      if (data) setUserName(JSON.parse(data).name || 'Paciente');
    });
    loadData();
  }, [loadData]);

  useEffect(() => {
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const usageSeconds = today?.todayUsageSeconds || 0;
  const adherence = today?.adherence || calculateAdherence(usageSeconds);
  const pauseSeconds = today?.todayPauseSeconds || 0;
  const longestBreak = today?.longestBreakSeconds || 0;
  const breakCount = today?.breakCount || 0;
  const status = today?.currentStatus || 'REMOVED';
  const statusColor = status === 'USING' ? colors.success : colors.danger;

  const getRiskColor = (r: string) => {
    if (r === 'Baixo') return colors.success;
    if (r === 'Medio') return colors.warning;
    return colors.danger;
  };

  const getAdherenceColor = (a: number) => {
    if (a >= 90) return colors.success;
    if (a >= 75) return colors.warning;
    return colors.danger;
  };

  const feedback = getUsageFeedback(usageSeconds / 3600);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Monitor</Text>
            <View style={styles.headerChips}>
              <View style={[styles.statusChip, { backgroundColor: statusColor }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.white }]} />
                <Text style={styles.chipText}>{status === 'USING' ? 'USANDO' : 'REMOVIDO'}</Text>
              </View>
              <View style={[styles.riskChip, { backgroundColor: getRiskColor(risk) }]}>
                <Text style={styles.chipText}>Risco {risk}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Main Summary Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Resumo do dia</Text>

          <Text style={styles.cardLabel}>Hoje você usou:</Text>
          <Text style={styles.cardValue}>{formatSeconds(usageSeconds)}</Text>

          {/* Progress Ring */}
          <View style={styles.progressRingContainer}>
            <View style={[styles.progressRingBg, { borderColor: getAdherenceColor(adherence) + '30' }]}>
              <View style={[styles.progressRingFill, { borderColor: getAdherenceColor(adherence) }]}>
                <Text style={[styles.progressRingText, { color: getAdherenceColor(adherence) }]}>{Math.round(adherence)}%</Text>
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="flag-outline" size={16} color={colors.success} />
              <Text style={styles.statValue}>22h</Text>
              <Text style={styles.statLabel}>Meta ideal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
              <Text style={styles.statValue}>18h</Text>
              <Text style={styles.statLabel}>Mínimo</Text>
            </View>
          </View>

          {/* Feedback Message */}
          <View style={styles.feedbackContainer}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color={feedback.color} />
            <Text style={[styles.feedbackText, { color: feedback.color }]}>{feedback.message}</Text>
          </View>
        </View>

        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="pause-circle-outline" size={20} color={colors.warning} />
            </View>
            <Text style={styles.metricValue}>{formatSeconds(pauseSeconds)}</Text>
            <Text style={styles.metricLabel}>Tempo sem uso</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="trending-down-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{formatSeconds(longestBreak)}</Text>
            <Text style={styles.metricLabel}>Maior pausa</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.danger + '15' }]}>
              <Ionicons name="alert-outline" size={20} color={colors.danger} />
            </View>
            <Text style={styles.metricValue}>{breakCount}</Text>
            <Text style={styles.metricLabel}>Pausas hoje</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: getRiskColor(risk) + '15' }]}>
              <Ionicons name="shield-outline" size={20} color={getRiskColor(risk)} />
            </View>
            <Text style={[styles.metricValue, { color: getRiskColor(risk) }]}>{risk}</Text>
            <Text style={styles.metricLabel}>Classificação</Text>
          </View>
        </View>

        {/* Feedback Card */}
        {adherence < 90 && (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackCardHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.success} />
              <Text style={styles.feedbackCardTitle}>Orientação</Text>
            </View>
            <Text style={styles.feedbackCardText}>
              {adherence < 50
                ? 'Risco de atraso no tratamento. Use o alinhador por mais tempo diariamente.'
                : 'Bom progresso! Continue mantendo o uso regular para atingir a meta diária de 22 horas.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  mainCard: {
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
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  progressRingContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressRingBg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingFill: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingText: {
    fontSize: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: spacing.md,
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
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  feedbackText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
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
  feedbackCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  feedbackCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  feedbackCardText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
});
