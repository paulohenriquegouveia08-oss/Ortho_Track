import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '../services/api';

const APP_VERSION = '1.0.8';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'clinic' | 'dentist' | 'patient';
  clinicId?: string;
  dentistId?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  restore: () => Promise<void>;
  login: (data: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  restore: async () => {
    try {
      const storedVersion = await AsyncStorage.getItem('orthotrack_version');
      if (storedVersion !== APP_VERSION) {
        await AsyncStorage.multiRemove([
          'orthotrack_token',
          'orthotrack_user',
          'orthotrack_patient_id',
          'timer_active',
          'timer_start',
          'timer_patient_id',
        ]);
        await AsyncStorage.setItem('orthotrack_version', APP_VERSION);
        set({ loading: false });
        return;
      }

      const token = await AsyncStorage.getItem('orthotrack_token');
      const userData = await AsyncStorage.getItem('orthotrack_user');

      if (!token || !userData) {
        set({ loading: false });
        return;
      }

      const user = JSON.parse(userData);

      if (!user || !user.id || !user.role || !user.email) {
        await AsyncStorage.multiRemove(['orthotrack_token', 'orthotrack_user']);
        set({ loading: false });
        return;
      }

      setToken(token);
      set({ user, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  login: async (data) => {
    await AsyncStorage.setItem('orthotrack_version', APP_VERSION);
    await AsyncStorage.setItem('orthotrack_token', data.token);
    await AsyncStorage.setItem('orthotrack_user', JSON.stringify(data.user));
    setToken(data.token);
    set({ user: data.user });
  },

  logout: async () => {
    await AsyncStorage.multiRemove([
      'orthotrack_token',
      'orthotrack_user',
      'orthotrack_patient_id',
      'timer_active',
      'timer_start',
      'timer_patient_id',
    ]);
    setToken(null);
    set({ user: null });
  },
}));
