import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { colors } from '../../src/theme/spacing';
import { useAuth } from '../../src/store/auth';

const APP_VERSION = Constants.expoConfig?.extra?.version || '1.0.0';

export default function ClinicLayout() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'clinic')) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }}>
        <Text style={{ color: colors.subtext }}>Carregando...</Text>
      </View>
    );
  }

  if (!user || user.role !== 'clinic') return null;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="invites" />
        <Stack.Screen name="users" />
        <Stack.Screen name="dentist/[id]" />
        <Stack.Screen name="patient/[id]" />
        <Stack.Screen name="patient/history" />
      </Stack>
      <View style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 4, alignItems: 'center' }}>
        <Text style={{ fontSize: 10, color: colors.subtext }}>OrthoTrack v{APP_VERSION}</Text>
      </View>
    </View>
  );
}
