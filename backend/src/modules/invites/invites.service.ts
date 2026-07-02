import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from './invite.entity';
import { Clinic } from '../clinics/clinic.entity';
import { User } from '../users/user.entity';

@Injectable()
export class InvitesService {
  constructor(
    @InjectRepository(Invite) private inviteRepo: Repository<Invite>,
    @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async validate(code: string) {
    const invite = await this.inviteRepo.findOne({ where: { code, used: false } });
    if (!invite || invite.expiresAt < new Date()) {
      throw new BadRequestException('Codigo invalido ou expirado');
    }
    let clinicName: string | undefined;
    if (invite.clinicId) {
      const clinic = await this.clinicRepo.findOne({ where: { id: invite.clinicId } });
      clinicName = clinic?.name;
    }
    return {
      type: invite.type,
      clinicId: invite.clinicId,
      dentistId: invite.dentistId,
      clinicName,
    };
  }

  async generateCode(type: string, clinicId?: string, dentistId?: string): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const prefix = type === 'clinic' ? 'CLINIC' : type === 'dentist' ? 'DENTIST' : 'PATIENT';
    let code = '';
    let exists = true;
    while (exists) {
      const random = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      code = `${prefix}-${random}`;
      const existing = await this.inviteRepo.findOne({ where: { code } });
      if (!existing) exists = false;
    }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.inviteRepo.save(this.inviteRepo.create({
      code,
      type,
      clinicId: clinicId || undefined,
      dentistId: dentistId || undefined,
      expiresAt,
    }));

    return code;
  }

  async generateForClinic(clinicId: string, type: string): Promise<string> {
    return this.generateCode(type, clinicId);
  }

  async generateForDoctor(clinicId: string, type: string): Promise<string> {
    return this.generateCode(type, clinicId);
  }
}
