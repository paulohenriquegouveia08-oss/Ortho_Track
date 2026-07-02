import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { clinicApi } from '../../src/services/api';

export default function InvitesScreen() {
  const router = useRouter();
  const [loadingDentist, setLoadingDentist] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  async function generateDentist() {
    setLoadingDentist(true);
    try {
      const data = await clinicApi.inviteDentist();
      setGeneratedCode(data.code);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoadingDentist(false);
    }
  }

  async function generatePatient() {
    setLoadingPatient(true);
    try {
      const data = await clinicApi.invitePatient();
      setGeneratedCode(data.code);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoadingPatient(false);
    }
  }

  async function copyCode() {
    await Clipboard.setStringAsync(generatedCode);
    Alert.alert('Copiado', 'Código copiado para a área de transferência');
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerar Convites</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.containerInner}>
          {/* Dentist Invite */}
          <View style={styles.inviteCard}>
            <View style={styles.inviteCardHeader}>
              <View style={[styles.inviteIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="medical-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.inviteCardInfo}>
                <Text style={styles.inviteTitle}>Convite para Dentista</Text>
                <Text style={styles.inviteDesc}>Gera um código para um dentista se cadastrar na clínica</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.inviteButton, loadingDentist && styles.buttonDisabled]}
              onPress={generateDentist}
              disabled={loadingDentist}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.white} />
              <Text style={styles.inviteButtonText}>{loadingDentist ? 'Gerando...' : 'Gerar Convite'}</Text>
            </TouchableOpacity>
          </View>

          {/* Patient Invite */}
          <View style={styles.inviteCard}>
            <View style={styles.inviteCardHeader}>
              <View style={[styles.inviteIcon, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="people-outline" size={24} color={colors.success} />
              </View>
              <View style={styles.inviteCardInfo}>
                <Text style={styles.inviteTitle}>Convite para Paciente</Text>
                <Text style={styles.inviteDesc}>Gera um código para um paciente se cadastrar</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.inviteButton, { backgroundColor: colors.success }, loadingPatient && styles.buttonDisabled]}
              onPress={generatePatient}
              disabled={loadingPatient}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.white} />
              <Text style={styles.inviteButtonText}>{loadingPatient ? 'Gerando...' : 'Gerar Convite'}</Text>
            </TouchableOpacity>
          </View>

          {/* Generated Code */}
          {generatedCode ? (
            <View style={styles.codeCard}>
              <View style={styles.codeHeader}>
                <Ionicons name="key-outline" size={18} color={colors.primary} />
                <Text style={styles.codeTitle}>Código Gerado</Text>
              </View>
              <Text style={styles.codeValue}>{generatedCode}</Text>
              <Text style={styles.codeHint}>Envie este código para o profissional completar o cadastro</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyCode}>
                <Ionicons name="copy-outline" size={16} color={colors.white} />
                <Text style={styles.copyText}>Copiar Código</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
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
  headerRight: { width: 50 },
  scrollContent: { paddingBottom: spacing.xxl },
  containerInner: {
    padding: spacing.lg,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  inviteCard: {
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
  inviteCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  inviteIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteCardInfo: { flex: 1 },
  inviteTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  inviteDesc: { fontSize: 13, color: colors.subtext, marginTop: 2, lineHeight: 18 },
  inviteButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: { opacity: 0.6 },
  inviteButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  codeCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  codeTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  codeValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  codeHint: { fontSize: 12, color: colors.subtext, textAlign: 'center', marginBottom: spacing.md },
  copyButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  copyText: { color: colors.white, fontSize: 14, fontWeight: '600' },
});
