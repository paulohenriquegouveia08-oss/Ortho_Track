import { Redirect } from 'expo-router';
import { useAuth } from '../src/store/auth';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;

  if (user.role === 'admin') return <Redirect href="/(admin)" />;
  if (user.role === 'clinic') return <Redirect href="/(clinic)" />;
  if (user.role === 'dentist') return <Redirect href="/(dentist)" />;
  if (user.role === 'patient') return <Redirect href="/(patient)" />;

  return <Redirect href="/(auth)/login" />;
}
