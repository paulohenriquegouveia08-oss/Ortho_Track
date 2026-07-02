import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { dentistApi } from '../../src/services/api';
import { DentistPatient } from '../../src/types';
import { formatSeconds } from '../../src/utils/formatTime';

export default function PatientListScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<DentistPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'using' | 'notUsing' | 'alert'>('all');

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const data = await dentistApi.patients();
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => { setRefreshing(true); loadPatients(); };

  const filteredPatients = patients.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'using') return p.currentStatus === 'USING';
    if (filter === 'notUsing') return p.currentStatus !== 'USING';
    if (filter === 'alert') return p.risk === 'Alto';
    return true;
  });

  const totalPatients = patients.length;
  const usingCount = patients.filter(p => p.currentStatus === 'USING').length;
  const notUsingCount = patients.filter(p => p.currentStatus !== 'USING').length;
  const alertCount = patients.filter(p => p.risk === 'Alto').length;

  const hasHighRisk = patients.some(p => p.risk === 'Alto');

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Meus Pacientes</Text>
          <Text style={styles.headerSubtitle}>{totalPatients} paciente{totalPatients !== 1 ? 's' : ''}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.containerInner}>
          {/* Summary Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.metricValue}>{totalPatients}</Text>
              <Text style={styles.metricLabel}>Pacientes</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
              </View>
              <Text style={styles.metricValue}>{usingCount}</Text>
              <Text style={styles.metricLabel}>Em uso</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.danger + '15' }]}>
                <Ionicons name="close-circle-outline" size={20} color={colors.danger} />
              </View>
              <Text style={styles.metricValue}>{notUsingCount}</Text>
              <Text style={styles.metricLabel}>Sem uso</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.warning + '15' }]}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
              </View>
              <Text style={styles.metricValue}>{alertCount}</Text>
              <Text style={styles.metricLabel}>Em risco</Text>
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterContainer}>
            {(['all', 'using', 'notUsing', 'alert'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterTab, filter === f && styles.filterTabActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                  {f === 'all' ? 'Todos' : f === 'using' ? 'Em uso' : f === 'notUsing' ? 'Sem uso' : 'Risco alto'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Card */}
          {hasHighRisk && (
            <View style={styles.feedbackCard}>
              <View style={styles.feedbackHeader}>
                <Ionicons name="warning-outline" size={16} color={colors.warning} />
                <Text style={styles.feedbackTitle}>Atenção</Text>
              </View>
              <Text style={styles.feedbackText}>
                Existem pacientes com baixa aderência. Verifique os casos de risco alto e oriente o uso mínimo diário.
              </Text>
            </View>
          )}

          {/* Patient List */}
          {filteredPatients.length > 0 ? (
            filteredPatients.map((p) => {
              const riskColor = p.risk === 'Baixo' ? colors.success : p.risk === 'Medio' ? colors.warning : colors.danger;
              const statusColor = p.currentStatus === 'USING' ? colors.success : colors.danger;
              const adherence = p.adherence || 0;
              const adherenceColor = adherence >= 90 ? colors.success : adherence >= 75 ? colors.warning : colors.danger;

              return (
                <TouchableOpacity
                  key={p.id}
                  style={styles.patientCard}
                  onPress={() => router.push(`/(dentist)/patient/${p.id}`)}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <View style={styles.cardHeaderInfo}>
                      <Text style={styles.patientName}>{p.name}</Text>
                      <View style={styles.cardChips}>
                        <View style={[styles.chip, { backgroundColor: statusColor + '15' }]}>
                          <Text style={[styles.chipText, { color: statusColor }]}>
                            {p.currentStatus === 'USING' ? 'EM USO' : 'FORA DE USO'}
                          </Text>
                        </View>
                        <View style={[styles.chip, { backgroundColor: riskColor + '15' }]}>
                          <Text style={[styles.chipText, { color: riskColor }]}>Risco {p.risk}</Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                  </View>

                  {/* Card Metrics */}
                  <View style={styles.cardMetrics}>
                    <View style={styles.metricItem}>
                      <Ionicons name="time-outline" size={14} color={colors.primary} />
                      <Text style={styles.metricItemLabel}>Uso hoje</Text>
                      <Text style={styles.metricItemValue}>{formatSeconds(p.todayUsageSeconds)}</Text>
                    </View>
                    <View style={styles.metricDivider} />
                    <View style={styles.metricItem}>
                      <Ionicons name="checkmark-circle-outline" size={14} color={adherenceColor} />
                      <Text style={styles.metricItemLabel}>Aderência</Text>
                      <Text style={[styles.metricItemValue, { color: adherenceColor }]}>{adherence}%</Text>
                    </View>
                  </View>

                  {/* Goals Row */}
                  <View style={styles.goalsRow}>
                    <View style={styles.goalItem}>
                      <Text style={styles.goalLabel}>Mínimo</Text>
                      <Text style={styles.goalValue}>18h/dia</Text>
                    </View>
                    <View style={styles.goalDivider} />
                    <View style={styles.goalItem}>
                      <Text style={styles.goalLabel}>Meta</Text>
                      <Text style={styles.goalValue}>22h/dia</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="people-outline" size={40} color={colors.subtext} />
              <Text style={styles.emptyTitle}>Nenhum paciente encontrado</Text>
              <Text style={styles.emptySubtitle}>Gere um convite para adicionar pacientes à clínica.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: { padding: spacing.xs },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  headerSubtitle: { fontSize: 13, color: colors.white, opacity: 0.8, marginTop: 2 },
  headerRight: { width: 50 },
  scrollContent: { paddingBottom: spacing.xxl },
  containerInner: {
    padding: spacing.lg,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metricValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  metricLabel: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.subtext,
  },
  filterTextActive: {
    color: colors.white,
  },
  feedbackCard: {
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  feedbackTitle: { fontSize: 13, fontWeight: '600', color: colors.warning },
  feedbackText: { fontSize: 12, color: colors.text, lineHeight: 18 },
  patientCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  cardHeaderInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  cardChips: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  chipText: { fontSize: 11, fontWeight: '600' },
  cardMetrics: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricItemLabel: { fontSize: 12, color: colors.subtext },
  metricItemValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  metricDivider: { width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  goalsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  goalItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  goalLabel: { fontSize: 11, color: colors.subtext },
  goalValue: { fontSize: 12, fontWeight: '600', color: colors.text },
  goalDivider: { width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  emptySubtitle: { fontSize: 13, color: colors.subtext, textAlign: 'center', lineHeight: 18 },
});
