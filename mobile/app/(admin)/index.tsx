import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { adminApi } from '../../src/services/api';
import { useAuth } from '../../src/store/auth';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await adminApi.dashboard();
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
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin OrthoTrack</Text>
          <Text style={styles.headerDate}>{new Date().toLocaleDateString('pt-BR')}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={18} color={colors.white} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="business-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{data?.totalClinics || 0}</Text>
            <Text style={styles.metricLabel}>Clínicas</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
            </View>
            <Text style={styles.metricValue}>{data?.activeClinics || 0}</Text>
            <Text style={styles.metricLabel}>Ativas</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{data?.totalPatients || 0}</Text>
            <Text style={styles.metricLabel}>Pacientes</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.accent + '15' }]}>
              <Ionicons name="medical-outline" size={20} color={colors.accent} />
            </View>
            <Text style={styles.metricValue}>{data?.totalDentists || 0}</Text>
            <Text style={styles.metricLabel}>Dentistas</Text>
          </View>
        </View>

        {/* Primary Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(admin)/clinics')}>
          <Ionicons name="settings-outline" size={20} color={colors.white} />
          <Text style={styles.primaryButtonText}>Gerenciar Clínicas</Text>
        </TouchableOpacity>

        {/* Latest Clinics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas Clínicas</Text>

          {data?.clinics && data.clinics.length > 0 ? (
            data.clinics.map((c: any) => (
              <TouchableOpacity key={c.id} style={styles.clinicCard} onPress={() => router.push(`/(admin)/clinic/${c.id}`)}>
                <View style={styles.clinicHeader}>
                  <View style={styles.clinicIcon}>
                    <Ionicons name="business-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>{c.name}</Text>
                    <Text style={styles.clinicResponsible}>{c.responsibleName} • {c.city || 'N/I'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
                </View>
                <View style={styles.clinicStats}>
                  <View style={styles.clinicStatItem}>
                    <Ionicons name="people-outline" size={14} color={colors.primary} />
                    <Text style={styles.clinicStatValue}>{c.patientCount || 0}</Text>
                    <Text style={styles.clinicStatLabel}>pacientes</Text>
                  </View>
                  <View style={styles.clinicStatDivider} />
                  <View style={styles.clinicStatItem}>
                    <Ionicons name="medical-outline" size={14} color={colors.accent} />
                    <Text style={styles.clinicStatValue}>{c.dentistCount || 0}</Text>
                    <Text style={styles.clinicStatLabel}>dentistas</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={32} color={colors.subtext} />
              <Text style={styles.emptyTitle}>Nenhuma clínica cadastrada ainda.</Text>
              <Text style={styles.emptySubtitle}>Crie uma nova clínica para começar a usar o sistema.</Text>
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
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
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
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  clinicCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  clinicIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  clinicInfo: { flex: 1 },
  clinicName: { fontSize: 15, fontWeight: '600', color: colors.text },
  clinicResponsible: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  clinicStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  clinicStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clinicStatValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  clinicStatLabel: { fontSize: 12, color: colors.subtext },
  clinicStatDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
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
  emptyTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  emptySubtitle: { fontSize: 12, color: colors.subtext, textAlign: 'center' },
});
