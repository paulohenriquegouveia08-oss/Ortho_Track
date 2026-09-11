import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../src/store/auth';
import { initialize } from '../src/services/timer-service';
import UpdateChecker from '../src/components/UpdateChecker';

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync().catch(() => {});

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
    // Hide splash screen as soon as auth restore completes or fallback timer triggers
    const fallbackTimer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 2000);

    restore()
      .catch(() => {})
      .finally(() => {
        clearTimeout(fallbackTimer);
        SplashScreen.hideAsync().catch(() => {});
      });

    initialize().catch(() => {});

    return () => clearTimeout(fallbackTimer);
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
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(clinic)" />
        <Stack.Screen name="(dentist)" />
        <Stack.Screen name="(patient)" />
      </Stack>
    </>
  );
}
