import Constants from 'expo-constants';
import { User, AuthResponse, DashboardStats, PatientReport, DentistPatient, TodayUsage, WeekDay, InviteValidation, Clinic, UsageEvent } from '../types';

const API_BASE = Constants.expoConfig?.extra?.apiBaseUrl as string || 'http://localhost:3004/api';

let authToken: string | null = null;

export function setToken(token: string | null) {
  authToken = token;
}

export function getToken(): string | null {
  return authToken;
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro de rede' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data: { name: string; email: string; password: string; phone: string; inviteCode: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  registerClinic: (data: { name: string; cnpj: string; responsibleName: string; email: string; password: string; phone: string; address: string; city: string; inviteCode: string }) =>
    request('/auth/register-clinic', { method: 'POST', body: JSON.stringify(data) }),

  validateInvite: (code: string) =>
    request('/invites/validate', { method: 'POST', body: JSON.stringify({ code }) }),
};

// Admin
export const adminApi = {
  dashboard: () => request('/admin/dashboard'),
  clinics: () => request('/admin/clinics'),
  clinicDetails: (id: string) => request(`/admin/clinics/${id}`),
  createClinic: (data: { name: string }) =>
    request('/admin/clinics', { method: 'POST', body: JSON.stringify(data) }),
};

// Clinic
export const clinicApi = {
  dashboard: () => request('/clinic/dashboard'),
  users: () => request('/clinic/users'),
  inviteDentist: () => request('/clinic/invites/dentist', { method: 'POST', body: '{}' }),
  invitePatient: () => request('/clinic/invites/patient', { method: 'POST', body: '{}' }),
  // Use existing endpoints - dentist details from users list
  dentistDetails: async (id: string) => {
    const data = await request('/clinic/users');
    const dentist = data.dentists?.find((d: any) => d.id === id);
    if (!dentist) throw new Error('Dentista nao encontrado');
    return { ...dentist, patientCount: data.patients?.filter((p: any) => p.dentistId === id).length || 0 };
  },
  dentistPatients: async (id: string) => {
    const data = await request('/clinic/users');
    return (data.patients || [])
      .filter((p: any) => p.dentistId === id)
      .map((p: any) => ({
        id: p.id,
        name: p.user?.name || 'Desconhecido',
        currentStatus: p.currentStatus,
        todayUsageSeconds: 0,
        adherence: 0,
      }));
  },
  // Use existing patient data from users
  patientDetails: async (id: string) => {
    const data = await request('/clinic/users');
    const patient = data.patients?.find((p: any) => p.id === id);
    if (!patient) throw new Error('Paciente nao encontrado');
    return {
      id: patient.id,
      name: patient.user?.name || 'Desconhecido',
      email: patient.user?.email || '',
      currentStatus: patient.currentStatus,
      treatmentStartDate: patient.treatmentStartDate,
    };
  },
  linkPatientToDentist: async (dentistId: string, patientId: string) => {
    return request(`/clinic/dentists/${dentistId}/link-patient`, {
      method: 'POST',
      body: JSON.stringify({ patientId }),
    });
  },
  unlinkPatientFromDentist: async (dentistId: string, patientId: string) => {
    return request(`/clinic/dentists/${dentistId}/unlink-patient/${patientId}`, {
      method: 'DELETE',
    });
  },
};

// Usage
export const usageApi = {
  recordEvent: (patientId: string, type: string) =>
    request('/usage/event', { method: 'POST', body: JSON.stringify({ patientId, type }) }),
  today: (patientId: string) => request(`/usage/today/${patientId}`),
  week: (patientId: string) => request(`/usage/week/${patientId}`),
  history: (patientId: string) => request(`/usage/history/${patientId}`),
  report: (patientId: string) => request(`/report/${patientId}`),
  currentSession: (patientId: string) => request(`/usage/current-session/${patientId}`),
};

// Dentist
export const dentistApi = {
  dashboard: () => request('/dentist/dashboard'),
  patients: () => request('/dentist/patients'),
  patientDetails: (id: string) => request(`/dentist/patients/${id}`),
};
