import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { clinicApi } from '../../src/services/api';

export default function UsersScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clinicApi.users().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.white} /></View>;
  }

  const dentists = data?.dentists || [];
  const patients = data?.patients || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Equipe e Pacientes</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerChips}>
          <View style={styles.chip}>
            <Ionicons name="medical-outline" size={14} color={colors.white} />
            <Text style={styles.chipText}>{dentists.length} dentista{dentists.length !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.chip}>
            <Ionicons name="people-outline" size={14} color={colors.white} />
            <Text style={styles.chipText}>{patients.length} paciente{patients.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* Dentists Section */}
        {dentists.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="medical-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Dentistas</Text>
            </View>
            {dentists.map((d: any) => (
              <TouchableOpacity
                key={d.id}
                style={styles.card}
                onPress={() => router.push(`/(clinic)/dentist/${d.id}`)}
              >
                <View style={styles.cardIcon}>
                  <Ionicons name="person-outline" size={20} color={colors.white} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardName}>{d.name}</Text>
                  <Text style={styles.cardSub}>{d.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Patients Section */}
        {patients.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="people-outline" size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Pacientes</Text>
            </View>
            {patients.map((p: any) => {
              const isUsing = p.currentStatus === 'USING';
              return (
                <TouchableOpacity
                  key={p.id}
                  style={styles.card}
                  onPress={() => router.push(`/(clinic)/patient/${p.id}`)}
                >
                  <View style={[styles.statusDot, { backgroundColor: isUsing ? colors.success : colors.danger }]} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardName}>{p.user?.name || 'N/I'}</Text>
                    <View style={styles.statusRow}>
                      <View style={[styles.statusBadge, { backgroundColor: (isUsing ? colors.success : colors.danger) + '15' }]}>
                        <View style={[styles.statusBadgeDot, { backgroundColor: isUsing ? colors.success : colors.danger }]} />
                        <Text style={[styles.statusBadgeText, { color: isUsing ? colors.success : colors.danger }]}>
                          {isUsing ? 'EM USO' : 'SEM USO'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {dentists.length === 0 && patients.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>Nenhum membro encontrado</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  header: { backgroundColor: colors.primary, paddingTop: 50, paddingBottom: spacing.md, paddingHorizontal: spacing.lg },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white + '20', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.white },
  headerChips: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.sm },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.white + '20', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.sm },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.white },
  scrollContent: { flex: 1 },
  scrollContentContainer: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md, marginTop: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  cardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  cardContent: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: '600', color: colors.text },
  cardSub: { fontSize: 13, color: colors.subtext, marginTop: 1 },
  statusRow: { flexDirection: 'row', marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  statusBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadgeText: { fontSize: 11, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyText: { fontSize: 14, color: colors.subtext, marginTop: spacing.md },
});
