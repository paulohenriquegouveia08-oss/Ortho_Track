import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../src/theme/spacing';
import { usageApi, dentistApi } from '../../../src/services/api';

type Period = 'today' | 'week' | 'month';

export default function PatientDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<Period>('today');

  const fetchData = useCallback(async () => {
    try {
      const [r, info] = await Promise.all([
        usageApi.report(id as string),
        dentistApi.patientDetails(id as string),
      ]);
      setReport(r);
      setPatientInfo(info);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatSeconds = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(1);
  };

  const getStatusColor = (status: string) => {
    return status === 'USING' ? colors.success : colors.danger;
  };

  const getStatusText = (status: string) => {
    return status === 'USING' ? 'USANDO' : 'REMOVIDO';
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return colors.success;
    if (adherence >= 75) return colors.warning;
    return colors.danger;
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'Baixo') return colors.success;
    if (risk === 'Medio') return colors.warning;
    return colors.danger;
  };

  const getWeekdayName = (date: string) => {
    const [y, m, d] = date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    return days[dt.getDay()];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
        <Text style={styles.errorText}>Erro ao carregar dados</Text>
      </View>
    );
  }

  const today = report?.today || {};
  const weekly = report?.weekly || {};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Paciente</Text>
            <View style={styles.headerChips}>
              <View style={[styles.statusChip, { backgroundColor: getStatusColor(report?.currentStatus) }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.white }]} />
                <Text style={styles.chipText}>{getStatusText(report?.currentStatus)}</Text>
              </View>
              {report?.risk && (
                <View style={[styles.riskChip, { backgroundColor: getRiskColor(report.risk) }]}>
                  <Text style={styles.chipText}>Risco {report.risk}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientHeader}>
            <View style={styles.patientAvatar}>
              <Text style={styles.avatarText}>{(patientInfo?.name || 'P')[0].toUpperCase()}</Text>
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patientInfo?.name || 'Paciente'}</Text>
              {patientInfo?.dentist && (
                <Text style={styles.dentistText}>Dentista: {patientInfo.dentist.name}</Text>
              )}
            </View>
          </View>
          <View style={styles.patientDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={16} color={colors.subtext} />
              <Text style={styles.detailLabel}>Tratamento</Text>
              <Text style={styles.detailValue}>Alinhadores removíveis</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="flag-outline" size={16} color={colors.subtext} />
              <Text style={styles.detailLabel}>Meta ideal</Text>
              <Text style={styles.detailValue}>22h/dia</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.subtext} />
              <Text style={styles.detailLabel}>Mínimo</Text>
              <Text style={styles.detailValue}>18h/dia</Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p === 'today' ? 'Hoje' : p === 'week' ? 'Semana' : 'Mês'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today View */}
        {period === 'today' && (
          <>
            {/* Status Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Status Atual</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusIcon, { backgroundColor: getStatusColor(report?.currentStatus) }]}>
                  <Ionicons
                    name={report?.currentStatus === 'USING' ? 'checkmark' : 'close'}
                    size={28}
                    color={colors.white}
                  />
                </View>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusText}>{getStatusText(report?.currentStatus)}</Text>
                  <Text style={styles.statusDescription}>
                    {report?.currentStatus === 'USING' ? 'Alinhador sendo utilizado' : 'Alinhador removido'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Usage Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="time-outline" size={24} color={colors.primary} />
                <Text style={styles.statValue}>{formatHours(today.usageSeconds || 0)}h</Text>
                <Text style={styles.statLabel}>Uso Hoje</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="pause-outline" size={24} color={colors.warning} />
                <Text style={styles.statValue}>{formatHours(today.pauseSeconds || 0)}h</Text>
                <Text style={styles.statLabel}>Pausa Hoje</Text>
              </View>
            </View>

            {/* Adherence Card */}
            <View style={styles.card}>
              <View style={styles.adherenceHeader}>
                <Text style={styles.cardTitle}>Aderência</Text>
                <View style={[styles.adherenceBadge, { backgroundColor: getAdherenceColor(today.adherence || 0) }]}>
                  <Text style={styles.adherenceBadgeText}>{today.adherence || 0}%</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(today.adherence || 0, 100)}%`, backgroundColor: getAdherenceColor(today.adherence || 0) }]} />
              </View>
              <Text style={styles.metaText}>Meta: 22h/dia</Text>
            </View>

            {/* Break Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Pausas</Text>
                <Text style={styles.statValue}>{today.breakCount || 0}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Maior Pausa</Text>
                <Text style={styles.statValue}>{formatSeconds(today.longestBreakSeconds || 0)}</Text>
              </View>
            </View>
          </>
        )}

        {/* Week View */}
        {period === 'week' && (
          <>
            {/* Weekly Average */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Média Semanal</Text>
              <View style={styles.weeklyStats}>
                <View style={styles.weeklyStat}>
                  <Text style={styles.weeklyValue}>{formatHours(weekly.avgSeconds || 0)}h</Text>
                  <Text style={styles.weeklyLabel}>Média de uso</Text>
                </View>
                <View style={styles.weeklyStat}>
                  <Text style={[styles.weeklyValue, { color: getAdherenceColor(weekly.avgAdherence || 0) }]}>
                    {weekly.avgAdherence || 0}%
                  </Text>
                  <Text style={styles.weeklyLabel}>Média aderência</Text>
                </View>
              </View>
            </View>

            {/* Daily Chart */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Uso Diário</Text>
              {(weekly.days || []).map((day: any, index: number) => (
                <View key={index} style={styles.dayRow}>
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayName}>{getWeekdayName(day.date)}</Text>
                    <Text style={styles.dayDate}>{day.date?.split('-').slice(1).reverse().join('/')}</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { width: `${Math.min((day.usageSeconds / (22 * 3600)) * 100, 100)}%`, backgroundColor: getAdherenceColor(day.adherence) }]} />
                  </View>
                  <Text style={styles.dayValue}>{formatHours(day.usageSeconds)}h</Text>
                </View>
              ))}
            </View>

            {/* Best/Worst Day */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: colors.successLight }]}>
                <Ionicons name="trophy-outline" size={20} color={colors.success} />
                <Text style={[styles.statValue, { color: colors.success }]}>
                  {weekly.bestDay ? `${formatHours(weekly.bestDay.usageSeconds)}h` : '-'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.success }]}>Melhor Dia</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.dangerLight }]}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
                <Text style={[styles.statValue, { color: colors.danger }]}>
                  {weekly.worstDay ? `${formatHours(weekly.worstDay.usageSeconds)}h` : '-'}
                </Text>
                <Text style={[styles.statLabel, { color: colors.danger }]}>Pior Dia</Text>
              </View>
            </View>
          </>
        )}

        {/* Month View */}
        {period === 'month' && (
          <>
            {/* Monthly Summary */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Resumo Mensal</Text>
              <View style={styles.weeklyStats}>
                <View style={styles.weeklyStat}>
                  <Text style={styles.weeklyValue}>{formatHours(weekly.avgSeconds || 0)}h</Text>
                  <Text style={styles.weeklyLabel}>Média Diária</Text>
                </View>
                <View style={styles.weeklyStat}>
                  <Text style={[styles.weeklyValue, { color: getAdherenceColor(weekly.avgAdherence || 0) }]}>
                    {weekly.avgAdherence || 0}%
                  </Text>
                  <Text style={styles.weeklyLabel}>Aderência</Text>
                </View>
              </View>
            </View>

            {/* Monthly Goals */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Metas</Text>
              <View style={styles.goalsRow}>
                <View style={styles.goalItem}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
                  <Text style={styles.goalValue}>22h/dia</Text>
                  <Text style={styles.goalLabel}>Uso Ideal</Text>
                </View>
                <View style={styles.goalItem}>
                  <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
                  <Text style={styles.goalValue}>18h/dia</Text>
                  <Text style={styles.goalLabel}>Mínimo</Text>
                </View>
                <View style={styles.goalItem}>
                  <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
                  <Text style={styles.goalValue}>90%+</Text>
                  <Text style={styles.goalLabel}>Aderência</Text>
                </View>
              </View>
            </View>

            {/* Risk Assessment */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Classificação de Risco</Text>
              <View style={styles.riskRow}>
                <View style={[styles.riskIcon, { backgroundColor: getRiskColor(report?.risk || 'Baixo') }]}>
                  <Ionicons
                    name={report?.risk === 'Baixo' ? 'checkmark-circle' : report?.risk === 'Medio' ? 'warning' : 'alert-circle'}
                    size={28}
                    color={colors.white}
                  />
                </View>
                <View style={styles.riskInfo}>
                  <Text style={styles.riskTitle}>Risco {report?.risk || 'Baixo'}</Text>
                  <Text style={styles.riskDescription}>
                    {report?.risk === 'Baixo' ? 'Aderência excelente' :
                     report?.risk === 'Medio' ? 'Aderência moderada' :
                     'Aderência insuficiente'}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Feedback */}
        {report?.feedback && (
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.success} />
              <Text style={styles.feedbackTitle}>Feedback</Text>
            </View>
            <Text style={styles.feedbackText}>{report.feedback}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.subtext,
    fontSize: 14,
  },
  errorText: {
    marginTop: spacing.md,
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  headerChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  riskChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  patientCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  dentistText: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  patientDetails: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  detailLabel: {
    fontSize: 13,
    color: colors.subtext,
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
  },
  periodTextActive: {
    color: colors.white,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statusDescription: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  adherenceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  adherenceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors.subtext,
  },
  weeklyStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  weeklyStat: {
    flex: 1,
  },
  weeklyValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  weeklyLabel: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  dayRow: {
    marginBottom: spacing.md,
  },
  dayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  dayName: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  dayDate: {
    fontSize: 11,
    color: colors.subtext,
  },
  barContainer: {
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  dayValue: {
    fontSize: 11,
    color: colors.subtext,
  },
  goalsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  goalItem: {
    flex: 1,
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    marginTop: spacing.xs,
  },
  goalLabel: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: spacing.xs,
  },
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  riskIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskInfo: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  riskDescription: {
    fontSize: 12,
    color: colors.subtext,
    marginTop: spacing.xs,
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
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  feedbackText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
});
