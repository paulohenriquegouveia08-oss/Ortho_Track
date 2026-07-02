import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { usageApi } from '../../src/services/api';
import { formatSeconds } from '../../src/utils/formatTime';
import { calculateAdherence, getRiskColor, getRiskLabel, getUsageFeedback } from '../../src/utils/calculateAdherence';

const DAILY_GOAL = 22 * 3600;
const MINIMUM_RECOMMENDED = 18 * 3600;

export default function ReportScreen() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('orthotrack_patient_id').then(pid => {
      if (pid) {
        usageApi.report(pid).then(setReport).catch(console.error).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (!report) {
    return <View style={styles.center}><Text style={{ color: colors.subtext }}>Nenhum dado disponível</Text></View>;
  }

  const avgHours = report.weekly.avgSeconds / 3600;
  const feedback = getUsageFeedback(avgHours);
  const riskLabel = getRiskLabel(report.weekly.avgAdherence);
  const riskColor = getRiskColor(report.weekly.avgAdherence);
  const status = report?.currentStatus || 'REMOVED';

  const getStatusColor = (s: string) => {
    return s === 'USING' ? colors.success : colors.danger;
  };

  const getBarColor = (adherence: number) => {
    if (adherence >= 90) return colors.success;
    if (adherence >= 75) return colors.warning;
    return colors.danger;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Relatório Semanal</Text>
            <View style={styles.headerChips}>
              <View style={[styles.statusChip, { backgroundColor: getStatusColor(status) }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.white }]} />
                <Text style={styles.chipText}>{status === 'USING' ? 'USANDO' : 'REMOVIDO'}</Text>
              </View>
              <View style={[styles.riskChip, { backgroundColor: riskColor }]}>
                <Text style={styles.chipText}>Risco {riskLabel}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* Main Summary Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Resumo da semana</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.summaryValue}>{formatSeconds(Math.round(report.weekly.avgSeconds))}</Text>
              <Text style={styles.summaryLabel}>Média de uso</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color={getBarColor(report.weekly.avgAdherence)} />
              <Text style={[styles.summaryValue, { color: getBarColor(report.weekly.avgAdherence) }]}>{report.weekly.avgAdherence || 0}%</Text>
              <Text style={styles.summaryLabel}>Aderência</Text>
            </View>
          </View>

          <View style={styles.goalsRow}>
            <View style={styles.goalItem}>
              <Ionicons name="flag-outline" size={14} color={colors.success} />
              <Text style={styles.goalValue}>22h/dia</Text>
              <Text style={styles.goalLabel}>Meta ideal</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.warning} />
              <Text style={styles.goalValue}>18h/dia</Text>
              <Text style={styles.goalLabel}>Mínimo</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="shield-outline" size={14} color={riskColor} />
              <Text style={[styles.goalValue, { color: riskColor }]}>{riskLabel}</Text>
              <Text style={styles.goalLabel}>Risco</Text>
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
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="today-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{formatSeconds(report.today.usageSeconds)}</Text>
            <Text style={styles.metricLabel}>Hoje</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="pause-circle-outline" size={20} color={colors.warning} />
            </View>
            <Text style={styles.metricValue}>{formatSeconds(report.today.pauseSeconds)}</Text>
            <Text style={styles.metricLabel}>Pausa hoje</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="arrow-up-circle-outline" size={20} color={colors.success} />
            </View>
            <Text style={styles.metricValue}>{report.weekly.bestDay ? formatSeconds(Math.round(report.weekly.bestDay.usageSeconds)) : '—'}</Text>
            <Text style={styles.metricLabel}>Melhor dia</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.danger + '15' }]}>
              <Ionicons name="arrow-down-circle-outline" size={20} color={colors.danger} />
            </View>
            <Text style={styles.metricValue}>{report.weekly.worstDay ? formatSeconds(Math.round(report.weekly.worstDay.usageSeconds)) : '—'}</Text>
            <Text style={styles.metricLabel}>Pior dia</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
            </View>
            <Text style={styles.metricValue}>{report.today.adherence}%</Text>
            <Text style={styles.metricLabel}>Aderência hoje</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="flag-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>22h</Text>
            <Text style={styles.metricLabel}>Meta ideal</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
            </View>
            <Text style={styles.metricValue}>18h</Text>
            <Text style={styles.metricLabel}>Mínimo</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: riskColor + '15' }]}>
              <Ionicons name="shield-outline" size={20} color={riskColor} />
            </View>
            <Text style={[styles.metricValue, { color: riskColor }]}>{riskLabel}</Text>
            <Text style={styles.metricLabel}>Classificação</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Últimos 7 dias</Text>
          {report.weekly.days?.map((d: any) => {
            const barWidth = Math.min((d.usageSeconds / DAILY_GOAL) * 100, 100);
            const barColor = getBarColor(d.adherence);
            const dayName = d.weekday?.slice(0, 3) || new Date(d.date).toLocaleDateString('pt-BR', { weekday: 'short' });
            return (
              <View key={d.date} style={styles.dayRow}>
                <Text style={styles.dayLabel}>{dayName}</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: barColor }]} />
                </View>
                <Text style={styles.dayValue}>{formatSeconds(Math.round(d.usageSeconds))}</Text>
              </View>
            );
          })}
        </View>

        {/* Pauses Card */}
        <View style={styles.pausesCard}>
          <Text style={styles.sectionTitle}>Pausas de hoje</Text>
          {report.pauses?.length > 0 ? (
            report.pauses.map((p: any, i: number) => (
              <View key={i} style={styles.pauseItem}>
                <Ionicons name="pause-outline" size={14} color={colors.warning} />
                <Text style={styles.pauseTime}>
                  {new Date(p.start).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={styles.pauseDuration}>{formatSeconds(p.duration)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma pausa registrada hoje.</Text>
          )}
        </View>

        {/* Feedback Card */}
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackCardHeader}>
            <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.success} />
            <Text style={styles.feedbackCardTitle}>Orientação</Text>
          </View>
          <Text style={styles.feedbackCardText}>
            {report.weekly.avgAdherence < 50
              ? 'Risco de atraso no tratamento. O uso semanal está abaixo do mínimo recomendado de 18h/dia.'
              : report.weekly.avgAdherence < 90
                ? 'Bom progresso! Continue mantendo o uso regular para atingir a meta diária de 22 horas.'
                : 'Excelente aderência! Continue mantendo o ritmo para garantir o sucesso do tratamento.'}
          </Text>
        </View>
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
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  goalItem: {
    alignItems: 'center',
    flex: 1,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  goalLabel: {
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
  chartCard: {
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayLabel: {
    width: 30,
    fontSize: 11,
    color: colors.subtext,
    fontWeight: '500',
  },
  barBg: {
    flex: 1,
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 10,
    marginHorizontal: spacing.sm,
  },
  barFill: {
    height: 20,
    borderRadius: 10,
  },
  dayValue: {
    width: 60,
    fontSize: 11,
    color: colors.subtext,
    textAlign: 'right',
  },
  pausesCard: {
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
  pauseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pauseTime: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  pauseDuration: {
    fontSize: 13,
    color: colors.subtext,
    marginLeft: 'auto',
  },
  emptyText: {
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
    paddingVertical: spacing.md,
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
