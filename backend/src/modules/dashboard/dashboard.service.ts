import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Clinic } from '../clinics/clinic.entity';
import { Patient } from '../patients/patient.entity';
import { DailyReport } from '../usage/daily-report.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(DailyReport) private reportRepo: Repository<DailyReport>,
  ) {}

  async getAdminDashboard() {
    const totalClinics = await this.clinicRepo.count();
    const activeClinics = await this.clinicRepo.count({ where: { status: 'active' } });
    const totalPatients = await this.patientRepo.count();
    const totalDentists = await this.userRepo.count({ where: { role: 'dentist', isActive: true } });
    
    const clinics = await this.clinicRepo.find({ order: { createdAt: 'DESC' }, take: 10 });
    const clinicsWithStats = await Promise.all(clinics.map(async (c) => {
      const patients = await this.patientRepo.count({ where: { clinicId: c.id } });
      const dentists = await this.userRepo.count({ where: { clinicId: c.id, role: 'dentist' } });
      return { ...c, patientCount: patients, dentistCount: dentists };
    }));

    return {
      totalClinics,
      activeClinics,
      totalPatients,
      totalDentists,
      clinics: clinicsWithStats,
    };
  }

  async getDentistDashboard(dentistId: string) {
    const patients = await this.patientRepo.find({ where: { dentistId } });
    const patientIds = patients.map(p => p.id);
    
    const usingNow = patients.filter(p => p.currentStatus === 'USING').length;
    const today = new Date().toISOString().split('T')[0];

    let avgAdherence = 0;
    let totalUsage = 0;
    if (patientIds.length > 0) {
      const reports = await this.reportRepo.find({ where: { patientId: patientIds.length === 1 ? patientIds[0] : patientIds as any, date: today } });
      const validReports = Array.isArray(reports) ? reports : [reports];
      if (validReports.length > 0) {
        avgAdherence = validReports.reduce((sum, r) => sum + parseFloat(String(r.adherence)), 0) / validReports.length;
        totalUsage = validReports.reduce((sum, r) => sum + (r.totalUsageSeconds || 0), 0);
      }
    }

    const inAlert = patients.filter(p => {
      const report = today ? null : null;
      return false; // simplified — will calculate from reports
    }).length;

    return {
      totalPatients: patients.length,
      usingNow,
      notUsingNow: patients.length - usingNow,
      inAlert,
      avgAdherence: Math.round(avgAdherence * 100) / 100,
      todayTotalUsage: totalUsage,
    };
  }

  async getDentistPatients(dentistId: string) {
    const patients = await this.patientRepo.find({ where: { dentistId } });
    const today = new Date().toISOString().split('T')[0];
    
    const result = await Promise.all(patients.map(async (p) => {
      const user = await this.userRepo.findOne({ where: { id: p.userId } });
      const report = await this.reportRepo.findOne({ where: { patientId: p.id, date: today } });
      const usageSeconds = report?.totalUsageSeconds || 0;
      const adherence = report?.adherence || 0;
      
      let risk: string;
      if (adherence >= 90) risk = 'Baixo';
      else if (adherence >= 75) risk = 'Medio';
      else risk = 'Alto';

      return {
        id: p.id,
        name: user?.name || 'Desconhecido',
        currentStatus: p.currentStatus,
        todayUsageSeconds: usageSeconds,
        adherence,
        risk,
        lastUpdate: p.createdAt,
      };
    }));

    return result;
  }
}
