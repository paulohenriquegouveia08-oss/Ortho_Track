import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { authApi } from '../../src/services/api';

export default function InviteScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleValidate() {
    if (!code.trim()) {
      Alert.alert('Atenção', 'Digite um código de convite');
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.validateInvite(code.trim().toUpperCase());
      if (result.type === 'clinic') {
        router.push({ pathname: '/(auth)/register-clinic', params: { inviteCode: code.trim().toUpperCase() } });
      } else {
        router.push({ pathname: '/(auth)/register-patient', params: { inviteCode: code.trim().toUpperCase(), type: result.type, clinicId: result.clinicId || '', dentistId: result.dentistId || '', clinicName: result.clinicName || '' } });
      }
    } catch (err: any) {
      Alert.alert('Código inválido', 'Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="key-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Código de Convite</Text>
          <Text style={styles.subtitle}>Digite o código fornecido pela sua clínica ou dentista para criar sua conta</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color={colors.subtext} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: CLINICA-2026"
                placeholderTextColor={colors.subtext}
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
              />
              {code.length > 0 && (
                <TouchableOpacity onPress={() => setCode('')} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color={colors.subtext} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleValidate}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name={loading ? 'sync-outline' : 'arrow-forward-outline'} size={18} color={colors.white} />
            <Text style={styles.buttonText}>{loading ? 'Validando...' : 'Validar código'}</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={16} color={colors.subtext} />
          <Text style={styles.infoText}>O código de convite é gerado pela clínica ou pelo administrador. Ele expira após Some uses.</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, justifyContent: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xl, position: 'absolute', top: spacing.xxl, left: spacing.lg },
  backText: { color: colors.primary, fontSize: 16, fontWeight: '500' },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  iconContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.xs, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.subtext, textAlign: 'center', lineHeight: 20, paddingHorizontal: spacing.lg },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  inputGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: borderRadius.sm, backgroundColor: colors.white },
  inputIcon: { paddingLeft: spacing.md },
  input: { flex: 1, padding: spacing.md, paddingLeft: spacing.sm, fontSize: 18, color: colors.text, textAlign: 'center', letterSpacing: 2, fontWeight: '600' },
  clearButton: { paddingRight: spacing.md },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.primary, borderRadius: borderRadius.sm, padding: spacing.md, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.sm },
  infoText: { flex: 1, fontSize: 12, color: colors.subtext, lineHeight: 18 },
});
