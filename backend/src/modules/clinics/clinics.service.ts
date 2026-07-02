import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './clinic.entity';
import { User } from '../users/user.entity';
import { Patient } from '../patients/patient.entity';
import { Invite } from '../invites/invite.entity';
import { DailyReport } from '../usage/daily-report.entity';
import { CreateClinicDto } from './dto/clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Invite) private inviteRepo: Repository<Invite>,
    @InjectRepository(DailyReport) private reportRepo: Repository<DailyReport>,
  ) {}

  async create(dto: CreateClinicDto): Promise<{ clinic: Clinic; inviteCode: string }> {
    const clinic = this.clinicRepo.create({ name: dto.name });
    const saved = await this.clinicRepo.save(clinic);

    const code = `CLINICA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await this.inviteRepo.save(this.inviteRepo.create({
      code,
      type: 'clinic',
      clinicId: saved.id,
      expiresAt,
    }));

    return { clinic: saved, inviteCode: code };
  }

  async findAll(): Promise<Clinic[]> {
    return this.clinicRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Clinic> {
    const clinic = await this.clinicRepo.findOne({ where: { id } });
    if (!clinic) throw new NotFoundException('Clinica nao encontrada');
    return clinic;
  }

  async findByIdDetailed(id: string) {
    const clinic = await this.clinicRepo.findOne({ where: { id } });
    if (!clinic) throw new NotFoundException('Clinica nao encontrada');

    const dentists = await this.userRepo.find({
      where: { clinicId: id, role: 'dentist', isActive: true },
      select: ['id', 'name', 'email', 'phone', 'createdAt'],
    });

    const patients = await this.patientRepo.find({ where: { clinicId: id } });
    const patientIds = patients.map(p => p.id);

    const patientsWithUser = await Promise.all(patients.map(async (p) => {
      const user = await this.userRepo.findOne({ where: { id: p.userId }, select: ['name', 'email'] });
      return {
        id: p.id,
        name: user?.name || 'Desconhecido',
        email: user?.email || '',
        currentStatus: p.currentStatus,
        treatmentStartDate: p.treatmentStartDate,
        createdAt: p.createdAt,
      };
    }));

    const usingNow = patients.filter(p => p.currentStatus === 'USING').length;

    let avgAdherence = 0;
    if (patientIds.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const reports = await this.reportRepo
        .createQueryBuilder('r')
        .select('AVG(r.adherence)', 'avg')
        .where('r.patientId IN (:...ids)', { ids: patientIds })
        .andWhere('r.date = :today', { today })
        .getRawOne();
      avgAdherence = parseFloat(reports?.avg || '0');
    }

    return {
      ...clinic,
      totalDentists: dentists.length,
      totalPatients: patients.length,
      usingNow,
      notUsingNow: patients.length - usingNow,
      avgAdherence: Math.round(avgAdherence * 100) / 100,
      dentists,
      patients: patientsWithUser,
    };
  }

  async getDashboard(clinicId: string) {
    const dentists = await this.userRepo.count({ where: { clinicId, role: 'dentist', isActive: true } });
    const patients = await this.patientRepo.find({ where: { clinicId } });
    const patientIds = patients.map(p => p.id);
    
    const usingNow = patients.filter(p => p.currentStatus === 'USING').length;
    
    let avgAdherence = 0;
    if (patientIds.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const reports = await this.reportRepo
        .createQueryBuilder('r')
        .select('AVG(r.adherence)', 'avg')
        .where('r.patientId IN (:...ids)', { ids: patientIds })
        .andWhere('r.date = :today', { today })
        .getRawOne();
      avgAdherence = parseFloat(reports?.avg || '0');
    }

    return {
      totalPatients: patients.length,
      activeDentists: dentists,
      usingNow,
      notUsingNow: patients.length - usingNow,
      avgAdherence: Math.round(avgAdherence * 100) / 100,
    };
  }

  async getUsers(clinicId: string) {
    const users = await this.userRepo.find({
      where: { clinicId },
      order: { createdAt: 'DESC' },
    });
    const patients = await this.patientRepo.find({
      where: { clinicId },
      order: { createdAt: 'DESC' },
    });
    return {
      dentists: users.filter(u => u.role === 'dentist'),
      patients: patients.map(p => {
        const u = users.find(us => us.id === p.userId);
        return { ...p, user: u || null };
      }),
      clinicUsers: users.filter(u => u.role === 'clinic'),
    };
  }

  async linkPatientToDentist(clinicId: string, dentistId: string, patientId: string) {
    const dentist = await this.userRepo.findOne({
      where: { id: dentistId, clinicId, role: 'dentist' },
    });
    if (!dentist) throw new NotFoundException('Dentista nao encontrado nesta clinica');

    const patient = await this.patientRepo.findOne({
      where: { id: patientId, clinicId },
    });
    if (!patient) throw new NotFoundException('Paciente nao encontrado nesta clinica');

    patient.dentistId = dentistId;
    await this.patientRepo.save(patient);

    return { success: true, patientId, dentistId };
  }

  async unlinkPatientFromDentist(clinicId: string, dentistId: string, patientId: string) {
    const patient = await this.patientRepo.findOne({
      where: { id: patientId, clinicId, dentistId },
    });
    if (!patient) throw new NotFoundException('Paciente nao encontrado vinculado a este dentista');

    patient.dentistId = null as any;
    await this.patientRepo.save(patient);

    return { success: true, patientId };
  }
}
