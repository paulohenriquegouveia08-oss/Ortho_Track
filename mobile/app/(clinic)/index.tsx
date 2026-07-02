import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { clinicApi } from '../../src/services/api';
import { useAuth } from '../../src/store/auth';

export default function ClinicDashboardScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDashboard(); }, []);

  async function loadDashboard() {
    try {
      const result = await clinicApi.dashboard();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await useAuth.getState().logout();
    router.replace('/(auth)/login');
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.white} /></View>;
  }

  const avgAdherence = data?.avgAdherence || 0;
  const adherenceColor = avgAdherence >= 90 ? colors.success : avgAdherence >= 75 ? colors.warning : colors.danger;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Painel da Clínica</Text>
            <Text style={styles.headerSubtitle}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <TouchableOpacity style={styles.metricCard} onPress={() => router.push('/(clinic)/users')}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{data?.totalPatients || 0}</Text>
            <Text style={styles.metricLabel}>Pacientes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.metricCard} onPress={() => router.push('/(clinic)/users')}>
            <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="medical-outline" size={20} color={colors.success} />
            </View>
            <Text style={styles.metricValue}>{data?.activeDentists || 0}</Text>
            <Text style={styles.metricLabel}>Dentistas</Text>
          </TouchableOpacity>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
            </View>
            <Text style={styles.metricValue}>{data?.usingNow || 0}</Text>
            <Text style={styles.metricLabel}>Em uso agora</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: (data?.notUsingNow > 0 ? colors.danger : colors.subtext) + '15' }]}>
              <Ionicons name="close-circle-outline" size={20} color={data?.notUsingNow > 0 ? colors.danger : colors.subtext} />
            </View>
            <Text style={[styles.metricValue, { color: data?.notUsingNow > 0 ? colors.danger : colors.text }]}>{data?.notUsingNow || 0}</Text>
            <Text style={styles.metricLabel}>Sem uso</Text>
          </View>
        </View>

        {/* Adherence Card */}
        {avgAdherence > 0 && (
          <View style={styles.adherenceCard}>
            <View style={styles.adherenceHeader}>
              <Ionicons name="trending-up-outline" size={16} color={colors.subtext} />
              <Text style={styles.adherenceHeaderLabel}>Aderência Média da Clínica</Text>
            </View>
            <Text style={[styles.adherenceValue, { color: adherenceColor }]}>{avgAdherence}%</Text>
            <View style={styles.adherenceBarBg}>
              <View style={[styles.adherenceBarFill, { width: `${Math.min(avgAdherence, 100)}%`, backgroundColor: adherenceColor }]} />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(clinic)/invites')}>
          <Ionicons name="key-outline" size={20} color={colors.white} />
          <Text style={styles.primaryButtonText}>Gerar Convites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(clinic)/users')}>
          <Ionicons name="people-outline" size={20} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Ver Equipe e Pacientes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  header: { backgroundColor: colors.primary, paddingTop: 50, paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white },
  headerSubtitle: { fontSize: 13, color: colors.white + '99', marginTop: 2 },
  logoutBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white + '20', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { flex: 1 },
  scrollContentContainer: { padding: spacing.lg, paddingBottom: spacing.xxl },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  metricCard: { width: '48%', backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  metricIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  metricValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  metricLabel: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  adherenceCard: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  adherenceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  adherenceHeaderLabel: { fontSize: 13, color: colors.subtext },
  adherenceValue: { fontSize: 36, fontWeight: '700', marginBottom: spacing.sm },
  adherenceBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  adherenceBarFill: { height: 8, borderRadius: 4 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  primaryButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.primary, borderRadius: borderRadius.lg, padding: spacing.md },
  secondaryButtonText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});
