import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { useAuth } from '../../src/store/auth';
import { usageApi } from '../../src/services/api';
import { stopTimerOnLogout } from '../../src/services/timer-service';
import ConfirmActionModal from '../../src/components/ConfirmActionModal';

interface DentistInfo {
  name: string;
  email: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [dentist, setDentist] = useState<DentistInfo | null>(null);
  const [loadingDentist, setLoadingDentist] = useState(true);
  const [risk, setRisk] = useState<string>('Baixo');
  const [status, setStatus] = useState<string>('REMOVED');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    loadDentistInfo();
  }, []);

  const loadDentistInfo = async () => {
    try {
      const report = await usageApi.report(user?.id || '');
      if (report?.dentist) {
        setDentist(report.dentist);
      }
      if (report?.risk) setRisk(report.risk);
      if (report?.currentStatus) setStatus(report.currentStatus);
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    } finally {
      setLoadingDentist(false);
    }
  };

  async function handleLogout() {
    if (status === 'USING') {
      setShowLogoutModal(true);
      return;
    }
    await useAuth.getState().logout();
    router.replace('/(auth)/login');
  }

  async function confirmLogoutStopTimer() {
    setShowLogoutModal(false);
    await stopTimerOnLogout();
    await useAuth.getState().logout();
    router.replace('/(auth)/login');
  }

  async function confirmLogoutKeepUsing() {
    setShowLogoutModal(false);
    await useAuth.getState().logout();
    router.replace('/(auth)/login');
  }

  const getRiskColor = (r: string) => {
    if (r === 'Baixo') return colors.success;
    if (r === 'Medio') return colors.warning;
    return colors.danger;
  };

  const getStatusColor = (s: string) => {
    return s === 'USING' ? colors.success : colors.danger;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Meu Perfil</Text>
            <View style={styles.headerChips}>
              <View style={[styles.statusChip, { backgroundColor: getStatusColor(status) }]}>
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

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || '?'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Paciente'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={16} color={colors.primary} />
              <Text style={styles.infoValue}>Paciente</Text>
              <Text style={styles.infoLabel}>Tipo</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="medical-outline" size={16} color={colors.primary} />
              <Text style={styles.infoValue}>Alinhadores</Text>
              <Text style={styles.infoLabel}>Tratamento</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="flag-outline" size={16} color={colors.success} />
              <Text style={styles.infoValue}>22h/dia</Text>
              <Text style={styles.infoLabel}>Meta ideal</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
              <Text style={styles.infoValue}>18h/dia</Text>
              <Text style={styles.infoLabel}>Mínimo</Text>
            </View>
          </View>
        </View>

        {/* Dentist Card */}
        {loadingDentist ? (
          <View style={styles.dentistCard}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : dentist ? (
          <View style={styles.dentistCard}>
            <View style={styles.dentistHeader}>
              <View style={styles.dentistIcon}>
                <Ionicons name="medical-outline" size={20} color={colors.white} />
              </View>
              <View style={styles.dentistHeaderInfo}>
                <Text style={styles.dentistTitle}>Meu Dentista</Text>
                <Text style={styles.dentistSubtitle}>Profissional responsável</Text>
              </View>
            </View>
            <View style={styles.dentistInfo}>
              <Ionicons name="person-circle-outline" size={32} color={colors.primary} />
              <View style={styles.dentistDetails}>
                <Text style={styles.dentistName}>{dentist.name}</Text>
                <Text style={styles.dentistEmail}>{dentist.email}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* Treatment Card */}
        <View style={styles.treatmentCard}>
          <Text style={styles.cardTitle}>Informações do Tratamento</Text>
          {[
            { label: 'Tipo', value: 'Paciente', icon: 'person-outline' },
            { label: 'Tratamento', value: 'Alinhadores removíveis', icon: 'medical-outline' },
            { label: 'Meta diária', value: '22 horas', icon: 'flag-outline' },
            { label: 'Mínimo', value: '18 horas', icon: 'alert-circle-outline' },
            { label: 'Status', value: status === 'USING' ? 'Em uso' : 'Sem uso', icon: 'checkmark-circle-outline' },
            { label: 'Risco', value: risk, icon: 'shield-outline' },
          ].map((item, i) => (
            <View key={i} style={styles.infoRow}>
              <Ionicons name={item.icon as any} size={16} color={colors.subtext} />
              <Text style={styles.infoRowLabel}>{item.label}</Text>
              <Text style={[styles.infoRowValue, item.label === 'Risco' && { color: getRiskColor(risk) }]}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmActionModal
        visible={showLogoutModal}
        title="Alinhador em uso"
        message="O alinhador está em uso. Deseja encerrar a sessão ao sair ou continuar usando?"
        confirmText="Encerrar e sair"
        cancelText="Continuar usando e sair"
        onConfirm={confirmLogoutStopTimer}
        onCancel={confirmLogoutKeepUsing}
        icon="warning-outline"
        variant="warning"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: spacing.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    width: '100%',
  },
  infoItem: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.subtext,
    marginTop: 2,
  },
  dentistCard: {
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
  dentistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  dentistIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dentistHeaderInfo: {
    flex: 1,
  },
  dentistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dentistSubtitle: {
    fontSize: 12,
    color: colors.subtext,
  },
  dentistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
  },
  dentistDetails: {
    flex: 1,
  },
  dentistName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dentistEmail: {
    fontSize: 13,
    color: colors.subtext,
    marginTop: 2,
  },
  treatmentCard: {
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  infoRowLabel: {
    fontSize: 14,
    color: colors.subtext,
    flex: 1,
  },
  infoRowValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
