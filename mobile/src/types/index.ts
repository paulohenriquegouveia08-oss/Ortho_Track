export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'clinic' | 'dentist' | 'patient';
  clinicId?: string;
  dentistId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Clinic {
  id: string;
  name: string;
  cnpj?: string;
  responsibleName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  plan: string;
  status: string;
  patientCount?: number;
  dentistCount?: number;
}

export interface Patient {
  id: string;
  userId: string;
  clinicId?: string;
  dentistId?: string;
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  treatmentStartDate?: string;
  currentStatus: 'USING' | 'REMOVED';
  user?: User;
}

export interface UsageEvent {
  id: string;
  patientId: string;
  type: 'USING' | 'REMOVED';
  timestamp: string;
  date: string;
}

export interface TodayUsage {
  currentStatus: 'USING' | 'REMOVED';
  todayUsageSeconds: number;
  todayPauseSeconds: number;
  adherence: number;
  breakCount: number;
  longestBreakSeconds: number;
  events: UsageEvent[];
}

export interface WeekDay {
  date: string;
  weekday: string;
  usageSeconds: number;
  pauseSeconds: number;
  adherence: number;
}

export interface PatientReport {
  patientId: string;
  currentStatus: string;
  today: {
    usageSeconds: number;
    pauseSeconds: number;
    adherence: number;
    breakCount: number;
    longestBreakSeconds: number;
  };
  weekly: {
    avgSeconds: number;
    avgAdherence: number;
    days: WeekDay[];
    bestDay: { date: string; usageSeconds: number } | null;
    worstDay: { date: string; usageSeconds: number } | null;
  };
  risk: string;
  feedback: string;
  pauses: Array<{ start: string; duration: number }>;
}

export interface DentistPatient {
  id: string;
  name: string;
  currentStatus: string;
  todayUsageSeconds: number;
  adherence: number;
  risk: string;
}

export interface InviteValidation {
  type: string;
  clinicId?: string;
  dentistId?: string;
  clinicName?: string;
}

export interface DashboardStats {
  totalPatients?: number;
  usingNow?: number;
  notUsingNow?: number;
  avgAdherence?: number;
  inAlert?: number;
  todayTotalUsage?: number;
  // Admin
  totalClinics?: number;
  activeClinics?: number;
  totalDentists?: number;
  clinics?: Clinic[];
}
