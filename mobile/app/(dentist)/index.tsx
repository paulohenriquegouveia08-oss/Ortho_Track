import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { dentistApi } from '../../src/services/api';
import { useAuth } from '../../src/store/auth';

export default function DentistDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const result = await dentistApi.dashboard();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => { setRefreshing(true); loadDashboard(); };

  async function handleLogout() {
    await useAuth.getState().logout();
    router.replace('/(auth)/login');
  }

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
        <View>
          <Text style={styles.headerTitle}>Painel do Dentista</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString('pt-BR')}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={18} color={colors.white} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.containerInner}>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="medical-outline" size={20} color={colors.primary} />
              <Text style={styles.summaryTitle}>Resumo dos Pacientes</Text>
            </View>
            <Text style={styles.summarySubtitle}>
              Acompanhe rapidamente quem está usando o alinhador e quem precisa de atenção.
            </Text>
          </View>

          {/* Metric Cards */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
              </View>
              <Text style={styles.metricValue}>{data?.totalPatients || 0}</Text>
              <Text style={styles.metricLabel}>Pacientes</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
              </View>
              <Text style={styles.metricValue}>{data?.usingNow || 0}</Text>
              <Text style={styles.metricLabel}>Em uso</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.danger + '15' }]}>
                <Ionicons name="close-circle-outline" size={20} color={colors.danger} />
              </View>
              <Text style={styles.metricValue}>{data?.notUsingNow || 0}</Text>
              <Text style={styles.metricLabel}>Sem uso</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: colors.warning + '15' }]}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
              </View>
              <Text style={styles.metricValue}>{data?.inAlert || 0}</Text>
              <Text style={styles.metricLabel}>Em alerta</Text>
            </View>
          </View>

          {/* View Patients Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(dentist)/patients')}>
            <Ionicons name="people-outline" size={20} color={colors.white} />
            <Text style={styles.primaryButtonText}>Ver Pacientes</Text>
          </TouchableOpacity>

          {/* Alert Section */}
          {data?.inAlert > 0 && (
            <View style={styles.alertSection}>
              <View style={styles.alertHeader}>
                <Ionicons name="warning-outline" size={18} color={colors.warning} />
                <Text style={styles.alertTitle}>Pacientes que precisam de atenção</Text>
              </View>
              {data.alertPatients && data.alertPatients.map((patient: any, index: number) => (
                <View key={index} style={styles.alertCard}>
                  <View style={styles.alertCardHeader}>
                    <View style={[styles.alertDot, { backgroundColor: colors.warning }]} />
                    <View style={styles.alertInfo}>
                      <Text style={styles.alertName}>{patient.name}</Text>
                      <Text style={styles.alertStatus}>{patient.status}</Text>
                    </View>
                  </View>
                  <View style={styles.alertStats}>
                    <View style={styles.alertStatItem}>
                      <Text style={styles.alertStatLabel}>Risco</Text>
                      <Text style={[styles.alertStatValue, { color: getRiskColor(patient.risk) }]}>{patient.risk}</Text>
                    </View>
                    <View style={styles.alertStatDivider} />
                    <View style={styles.alertStatItem}>
                      <Text style={styles.alertStatLabel}>Aderência</Text>
                      <Text style={styles.alertStatValue}>{patient.adherence}%</Text>
                    </View>
                    <View style={styles.alertStatDivider} />
                    <View style={styles.alertStatItem}>
                      <Text style={styles.alertStatLabel}>Uso Hoje</Text>
                      <Text style={styles.alertStatValue}>{patient.usageToday}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* No Alerts Card */}
          {(!data?.inAlert || data.inAlert === 0) && (
            <View style={styles.noAlertCard}>
              <Ionicons name="checkmark-circle-outline" size={32} color={colors.success} />
              <Text style={styles.noAlertTitle}>Nenhum paciente em alerta no momento.</Text>
              <Text style={styles.noAlertSubtitle}>Todos os pacientes estão seguindo o tratamento corretamente.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const getRiskColor = (risk: string) => {
  if (risk === 'Baixo') return colors.success;
  if (risk === 'Medio') return colors.warning;
  return colors.danger;
};

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
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  headerDate: { fontSize: 13, color: colors.white, opacity: 0.8, marginTop: 2 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  logoutText: { color: colors.white, fontSize: 14, fontWeight: '500' },
  scrollContent: { paddingBottom: spacing.xxl },
  containerInner: {
    padding: spacing.lg,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  summarySubtitle: { fontSize: 13, color: colors.subtext, lineHeight: 18 },
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
  metricValue: { fontSize: 28, fontWeight: '700', color: colors.text },
  metricLabel: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  alertSection: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  alertTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  alertDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  alertInfo: { flex: 1 },
  alertName: { fontSize: 14, fontWeight: '600', color: colors.text },
  alertStatus: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  alertStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  alertStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  alertStatValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  alertStatLabel: { fontSize: 12, color: colors.subtext },
  alertStatDivider: { width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  noAlertCard: {
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
  noAlertTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  noAlertSubtitle: { fontSize: 12, color: colors.subtext, textAlign: 'center', lineHeight: 18 },
});
