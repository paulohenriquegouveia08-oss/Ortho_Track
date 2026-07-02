import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { colors } from '../../src/theme/spacing';
import { useAuth } from '../../src/store/auth';

const APP_VERSION = Constants.expoConfig?.extra?.version || '1.0.0';

export default function DentistLayout() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'dentist')) {
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

  if (!user || user.role !== 'dentist') return null;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="patients" />
        <Stack.Screen name="patient/[id]" />
      </Stack>
      <View style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 4, alignItems: 'center' }}>
        <Text style={{ fontSize: 10, color: colors.subtext }}>OrthoTrack v{APP_VERSION}</Text>
      </View>
    </View>
  );
}
