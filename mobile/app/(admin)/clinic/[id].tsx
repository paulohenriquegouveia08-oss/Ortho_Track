import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../src/theme/spacing';
import { adminApi } from '../../../src/services/api';
import { formatSeconds } from '../../../src/utils/formatTime';

export default function ClinicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (id) loadClinic();
  }, [id]);

  async function loadClinic() {
    try {
      const result = await adminApi.clinicDetails(id!);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => { setRefreshing(true); loadClinic(); };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.subtext} />
        <Text style={{ color: colors.subtext, marginTop: spacing.md }}>Clínica não encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Voltar</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>{data.name}</Text>
        <View style={styles.headerRight}>
          {data.status && (
            <View style={[styles.statusChip, { backgroundColor: data.status === 'active' ? colors.success : colors.danger }]}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{data.status === 'active' ? 'Ativa' : 'Inativa'}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          {data.responsibleName && (
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
              <Text style={styles.infoLabel}>Responsável</Text>
              <Text style={styles.infoValue}>{data.responsibleName}</Text>
            </View>
          )}
          {data.cnpj && (
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={18} color={colors.primary} />
              <Text style={styles.infoLabel}>CNPJ</Text>
              <Text style={styles.infoValue}>{data.cnpj}</Text>
            </View>
          )}
          {data.email && (
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{data.email}</Text>
            </View>
          )}
          {data.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color={colors.primary} />
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{data.phone}</Text>
            </View>
          )}
          {data.city && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
              <Text style={styles.infoLabel}>Cidade</Text>
              <Text style={styles.infoValue}>{data.city}{data.uf ? `/${data.uf}` : ''}</Text>
            </View>
          )}
        </View>

        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{data.totalPatients || 0}</Text>
            <Text style={styles.metricLabel}>Pacientes</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
            </View>
            <Text style={styles.metricValue}>{data.usingNow || 0}</Text>
            <Text style={styles.metricLabel}>Em uso agora</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="medical-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{data.totalDentists || 0}</Text>
            <Text style={styles.metricLabel}>Dentistas</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: (data.avgAdherence >= 90 ? colors.success : data.avgAdherence >= 75 ? colors.warning : colors.danger) + '15' }]}>
              <Ionicons name="trending-up-outline" size={20} color={data.avgAdherence >= 90 ? colors.success : data.avgAdherence >= 75 ? colors.warning : colors.danger} />
            </View>
            <Text style={styles.metricValue}>{data.avgAdherence || 0}%</Text>
            <Text style={styles.metricLabel}>Aderência</Text>
          </View>
        </View>

        {/* Dentists Section */}
        {data.dentists && data.dentists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dentistas ({data.dentists.length})</Text>
            {data.dentists.map((d: any) => (
              <View key={d.id} style={styles.listCard}>
                <View style={styles.listIcon}>
                  <Ionicons name="medical-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{d.name}</Text>
                  <Text style={styles.listSub}>{d.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
              </View>
            ))}
          </View>
        )}

        {/* Patients Section */}
        {data.patients && data.patients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pacientes ({data.patients.length})</Text>
            {data.patients.map((p: any) => (
              <View key={p.id} style={styles.listCard}>
                <View style={[styles.listIcon, { backgroundColor: (p.currentStatus === 'USING' ? colors.success : colors.danger) + '15' }]}>
                  <View style={[styles.statusDot, { backgroundColor: p.currentStatus === 'USING' ? colors.success : colors.danger }]} />
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{p.name}</Text>
                  <Text style={styles.listSub}>
                    {p.currentStatus === 'USING' ? 'Em uso' : 'Fora de uso'} 
                    {p.treatmentStartDate ? ` \u2022 Início: ${new Date(p.treatmentStartDate).toLocaleDateString('pt-BR')}` : ''}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.subtext} />
              </View>
            ))}
          </View>
        )}
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.white, flex: 1, textAlign: 'center' },
  headerRight: { minWidth: 50, alignItems: 'flex-end' },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  statusText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  infoCard: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  infoLabel: { fontSize: 13, color: colors.subtext, width: 80 },
  infoValue: { fontSize: 14, fontWeight: '500', color: colors.text, flex: 1 },
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
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  listInfo: { flex: 1 },
  listName: { fontSize: 14, fontWeight: '600', color: colors.text },
  listSub: { fontSize: 12, color: colors.subtext, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
});
