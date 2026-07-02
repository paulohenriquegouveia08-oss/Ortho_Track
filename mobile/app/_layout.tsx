import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/store/auth';
import { initialize } from '../src/services/timer-service';
import UpdateChecker from '../src/components/UpdateChecker';

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      if (user.role === 'admin') router.replace('/(admin)');
      else if (user.role === 'clinic') router.replace('/(clinic)');
      else if (user.role === 'dentist') router.replace('/(dentist)');
      else if (user.role === 'patient') router.replace('/(patient)');
      else router.replace('/(auth)/login');
    }
  }, [user, loading, segments]);
}

export default function RootLayout() {
  const { loading, restore } = useAuth();

  useEffect(() => {
    restore().catch(() => {});
    initialize().catch(() => {});
  }, []);

  useProtectedRoute();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <UpdateChecker />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(clinic)" />
        <Stack.Screen name="(dentist)" />
        <Stack.Screen name="(patient)" />
      </Stack>
    </>
  );
}
