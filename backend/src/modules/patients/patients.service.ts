import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getPatientDetails(patientId: string) {
    let patient = await this.patientRepo.findOne({ where: { id: patientId } });
    if (!patient) patient = await this.patientRepo.findOne({ where: { userId: patientId } });
    if (!patient) throw new NotFoundException('Paciente nao encontrado');
    
    const user = await this.userRepo.findOne({ where: { id: patient.userId } });
    const dentist = patient.dentistId ? await this.userRepo.findOne({ where: { id: patient.dentistId } }) : null;

    return {
      id: patient.id,
      name: user?.name || 'Desconhecido',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: patient.birthDate,
      treatmentStartDate: patient.treatmentStartDate,
      currentStatus: patient.currentStatus,
      dentist: dentist ? { id: dentist.id, name: dentist.name } : null,
    };
  }
}
