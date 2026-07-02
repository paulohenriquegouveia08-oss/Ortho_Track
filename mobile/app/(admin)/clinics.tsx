import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { adminApi } from '../../src/services/api';

export default function ClinicListScreen() {
  const router = useRouter();
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => { loadClinics(); }, []);

  async function loadClinics() {
    try {
      const data = await adminApi.clinics();
      setClinics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => { setRefreshing(true); loadClinics(); };

  async function handleCreate() {
    if (!name) { Alert.alert('Atenção', 'Nome da clínica obrigatório'); return; }
    setCreating(true);
    try {
      const result = await adminApi.createClinic({ name });
      setInviteCode(result.inviteCode);
      Alert.alert('Clínica criada!', `Código de convite: ${result.inviteCode}\n\nEnvie este código para a clínica completar o cadastro.`);
      setName('');
      loadClinics();
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  // Compute summary stats
  const totalClinics = clinics.length;
  const totalPatients = clinics.reduce((sum, c) => sum + (c.patientCount || 0), 0);
  const totalDentists = clinics.reduce((sum, c) => sum + (c.dentistCount || 0), 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clínicas</Text>
        <TouchableOpacity onPress={() => setShowCreate(!showCreate)} style={styles.addButton}>
          <Ionicons name={showCreate ? 'close' : 'add'} size={20} color={colors.white} />
          <Text style={styles.addButtonText}>{showCreate ? 'Fechar' : 'Nova'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Create Form */}
        {showCreate && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.formTitle}>Nova Clínica</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome da Clínica</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Ortho Prime Londrina"
                placeholderTextColor={colors.subtext}
              />
            </View>
            <TouchableOpacity
              style={[styles.createButton, creating && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={creating}
            >
              <Text style={styles.createButtonText}>{creating ? 'Criando...' : 'Criar Clínica'}</Text>
            </TouchableOpacity>
            {inviteCode ? (
              <View style={styles.inviteBox}>
                <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
                <Text style={styles.inviteLabel}>Código de convite gerado:</Text>
                <Text style={styles.inviteCode}>{inviteCode}</Text>
                <Text style={styles.inviteHint}>Envie este código para a clínica se cadastrar</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Summary Metrics */}
        {clinics.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalClinics}</Text>
                <Text style={styles.summaryLabel}>Clínicas</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalPatients}</Text>
                <Text style={styles.summaryLabel}>Pacientes</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{totalDentists}</Text>
                <Text style={styles.summaryLabel}>Dentistas</Text>
              </View>
            </View>
          </View>
        )}

        {/* Clinic List */}
        {clinics.length > 0 ? (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Clínicas Cadastradas ({clinics.length})</Text>
            {clinics.map((c: any) => (
              <TouchableOpacity key={c.id} style={styles.clinicCard} onPress={() => router.push(`/(admin)/clinic/${c.id}`)}>
                <View style={styles.clinicHeader}>
                  <View style={styles.clinicIcon}>
                    <Ionicons name="business-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.clinicInfo}>
                    <Text style={styles.clinicName}>{c.name}</Text>
                    {c.responsibleName && (
                      <Text style={styles.clinicResponsible}>Responsável: {c.responsibleName}</Text>
                    )}
                    {c.email && (
                      <Text style={styles.clinicEmail}>{c.email}</Text>
                    )}
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
                    <Ionicons name="medical-outline" size={14} color={colors.primary} />
                    <Text style={styles.clinicStatValue}>{c.dentistCount || 0}</Text>
                    <Text style={styles.clinicStatLabel}>dentistas</Text>
                  </View>
                </View>
                {c.status && (
                  <View style={styles.statusRow}>
                    <View style={[styles.statusDot, { backgroundColor: c.status === 'active' || c.status === 'ativa' ? colors.success : colors.danger }]} />
                    <Text style={[styles.statusText, { color: c.status === 'active' || c.status === 'ativa' ? colors.success : colors.danger }]}>
                      {c.status === 'active' || c.status === 'ativa' ? 'Ativa' : 'Inativa'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={40} color={colors.subtext} />
            <Text style={styles.emptyTitle}>Nenhuma clínica cadastrada.</Text>
            <Text style={styles.emptySubtitle}>Crie uma nova clínica para começar a usar o sistema.</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => setShowCreate(true)}>
              <Ionicons name="add-circle-outline" size={18} color={colors.white} />
              <Text style={styles.emptyButtonText}>Criar primeira clínica</Text>
            </TouchableOpacity>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  addButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  formCard: {
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
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  formTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  inputGroup: { marginBottom: spacing.md },
  label: { fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.6 },
  createButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  inviteBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inviteLabel: { fontSize: 12, color: colors.subtext, flex: 1 },
  inviteCode: { fontSize: 18, fontWeight: '700', color: colors.success, textAlign: 'center', letterSpacing: 2, width: '100%' },
  inviteHint: { fontSize: 11, color: colors.subtext, textAlign: 'center', width: '100%' },
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryValue: { fontSize: 24, fontWeight: '700', color: colors.text },
  summaryLabel: { fontSize: 11, color: colors.subtext, marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.border },
  listSection: { marginTop: spacing.xs },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing.md },
  clinicCard: {
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
  clinicHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  clinicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  clinicInfo: { flex: 1 },
  clinicName: { fontSize: 16, fontWeight: '600', color: colors.text },
  clinicResponsible: { fontSize: 13, color: colors.subtext, marginTop: 2 },
  clinicEmail: { fontSize: 12, color: colors.subtext, marginTop: 1 },
  clinicStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  clinicStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  clinicStatValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  clinicStatLabel: { fontSize: 12, color: colors.subtext },
  clinicStatDivider: { width: 1, height: 16, backgroundColor: colors.border, marginHorizontal: spacing.xs },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
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
  emptySubtitle: { fontSize: 13, color: colors.subtext, textAlign: 'center', marginBottom: spacing.md, lineHeight: 18 },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyButtonText: { color: colors.white, fontSize: 14, fontWeight: '600' },
});
