import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { authApi } from '../../src/services/api';
import { useAuth } from '../../src/store/auth';
import { maskPhone, maskBirthDate, strip } from '../../src/utils/masks';

export default function RegisterPatientScreen() {
  const router = useRouter();
  const { inviteCode, clinicName } = useLocalSearchParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '', birthDate: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    if (field === 'phone') value = maskPhone(value);
    else if (field === 'birthDate') value = maskBirthDate(value);
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Atencao', 'Preencha os campos obrigatorios');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        phone: strip(form.phone),
        birthDate: strip(form.birthDate),
        inviteCode: inviteCode as string,
      };
      const data = await authApi.register(payload);
      await useAuth.getState().login(data);
      if (data.user.role === 'dentist') router.replace('/(dentist)');
      else router.replace('/(patient)');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>{'< Voltar'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Ativar sua conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados para comecar</Text>

        {clinicName ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Clinica</Text>
            <Text style={styles.infoValue}>{clinicName}</Text>
          </View>
        ) : null}

        {['name', 'email', 'phone', 'birthDate', 'password'].map(f => (
          <View key={f} style={styles.inputGroup}>
            <Text style={styles.label}>
              {f === 'birthDate' ? 'Data de Nascimento' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
            {f === 'password' ? (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={''}
                  placeholderTextColor={colors.subtext}
                  value={(form as any)[f]}
                  onChangeText={v => update(f, v)}
                  secureTextEntry={!showPassword}
                  autoCapitalize='none'
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={colors.subtext} />
                </TouchableOpacity>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder={f === 'birthDate' ? 'DD/MM/AAAA' : f === 'email' ? 'seu@email.com' : ''}
                placeholderTextColor={colors.subtext}
                value={(form as any)[f]}
                onChangeText={v => update(f, v)}
                keyboardType={f === 'email' ? 'email-address' : f === 'phone' ? 'phone-pad' : 'default'}
                autoCapitalize={f === 'email' ? 'none' : 'sentences'}
              />
            )}
          </View>
        ))}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Ativando...' : 'Ativar minha conta'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  back: { marginBottom: spacing.md },
  backText: { color: colors.primary, fontSize: 16 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: 14, color: colors.subtext, marginBottom: spacing.lg },
  infoCard: { backgroundColor: colors.primaryLight + '15', padding: spacing.md, borderRadius: borderRadius.sm, marginBottom: spacing.lg },
  infoLabel: { fontSize: 12, color: colors.subtext, marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  inputGroup: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.sm, padding: spacing.md, fontSize: 15, color: colors.text, backgroundColor: colors.card },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.sm, backgroundColor: colors.card },
  passwordInput: { flex: 1, padding: spacing.md, fontSize: 15, color: colors.text },
  eyeButton: { padding: spacing.md },
  button: { backgroundColor: colors.primary, borderRadius: borderRadius.sm, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
});
