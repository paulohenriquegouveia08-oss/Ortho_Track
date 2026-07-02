import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../src/theme/spacing';
import { authApi } from '../../src/services/api';
import { useAuth } from '../../src/store/auth';
import { maskPhone, maskCNPJ, strip } from '../../src/utils/masks';

export default function RegisterClinicScreen() {
  const router = useRouter();
  const { inviteCode } = useLocalSearchParams();
  const [form, setForm] = useState({ name: '', cnpj: '', responsibleName: '', email: '', password: '', phone: '', address: '', city: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    if (field === 'phone') value = maskPhone(value);
    else if (field === 'cnpj') value = maskCNPJ(value);
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleRegister() {
    if (!form.name || !form.responsibleName || !form.email || !form.password) {
      Alert.alert('Atencao', 'Preencha os campos obrigatorios');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        phone: strip(form.phone),
        cnpj: strip(form.cnpj),
        inviteCode: inviteCode as string,
      };
      const data = await authApi.registerClinic(payload);
      await useAuth.getState().login(data);
      router.replace('/(clinic)');
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { key: 'name', label: 'Nome da Clinica', placeholder: 'Minha Clinica' },
    { key: 'cnpj', label: 'CNPJ', placeholder: '00.000.000/0000-00' },
    { key: 'responsibleName', label: 'Nome do Responsavel', placeholder: 'Seu nome' },
    { key: 'email', label: 'Email', placeholder: 'contato@clinica.com', keyboardType: 'email-address' },
    { key: 'phone', label: 'Telefone', placeholder: '(43) 99999-9999' },
    { key: 'address', label: 'Endereco', placeholder: 'Rua, numero' },
    { key: 'city', label: 'Cidade', placeholder: 'Sua cidade - UF' },
    { key: 'password', label: 'Senha', placeholder: 'Minimo 6 caracteres', secure: true },
  ];

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>{'< Voltar'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Cadastro da Clinica</Text>
        <Text style={styles.subtitle}>Preencha seus dados para ativar sua conta</Text>

        <View style={styles.inviteBadge}>
          <Text style={styles.inviteBadgeText}>Convite: {inviteCode}</Text>
        </View>

        {fields.map(f => (
          <View key={f.key} style={styles.inputGroup}>
            <Text style={styles.label}>{f.label}</Text>
            {f.secure ? (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.subtext}
                  value={(form as any)[f.key]}
                  onChangeText={v => update(f.key, v)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={colors.subtext} />
                </TouchableOpacity>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={colors.subtext}
                value={(form as any)[f.key]}
                onChangeText={v => update(f.key, v)}
                keyboardType={(f as any).keyboardType || 'default'}
                autoCapitalize="none"
              />
            )}
          </View>
        ))}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar cadastro'}</Text>
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
  inviteBadge: { backgroundColor: colors.primaryLight + '20', padding: spacing.sm, borderRadius: borderRadius.sm, marginBottom: spacing.lg, alignItems: 'center' },
  inviteBadgeText: { color: colors.primary, fontWeight: '600', fontSize: 14 },
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
