import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Clinic } from '../clinics/clinic.entity';
import { Patient } from '../patients/patient.entity';
import { Invite } from '../invites/invite.entity';
import { LoginDto, RegisterDto, RegisterClinicDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Invite) private inviteRepo: Repository<Invite>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'name', 'email', 'password', 'role', 'clinicId', 'dentistId', 'isActive'],
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Conta desativada');
    }
    return this.generateToken(user);
  }

  async register(dto: RegisterDto) {
    const invite = await this.inviteRepo.findOne({ where: { code: dto.inviteCode, used: false } });
    if (!invite || invite.expiresAt < new Date()) {
      throw new BadRequestException('Codigo de convite invalido ou expirado');
    }

    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email ja cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      role: invite.type === 'patient' ? 'patient' : 'dentist',
      clinicId: invite.clinicId || undefined,
      dentistId: invite.dentistId || undefined,
    });
    const saved = await this.userRepo.save(user);

    if (invite.type === 'patient') {
      const birthDate = dto.birthDate
        ? dto.birthDate.replace(/\D/g, '').replace(/^(\d{2})(\d{2})(\d{4})$/, '$3-$2-$1')
        : undefined;
      await this.patientRepo.save(this.patientRepo.create({
        userId: saved.id,
        clinicId: invite.clinicId || undefined,
        dentistId: invite.dentistId || undefined,
        currentStatus: 'REMOVED',
        birthDate: birthDate,
      }));
    }

    invite.used = true;
    invite.usedBy = saved.id;
    await this.inviteRepo.save(invite);

    return this.generateToken(saved);
  }

  async registerClinic(dto: RegisterClinicDto) {
    const invite = await this.inviteRepo.findOne({ where: { code: dto.inviteCode, used: false, type: 'clinic' } });
    if (!invite || invite.expiresAt < new Date()) {
      throw new BadRequestException('Codigo de convite invalido ou expirado');
    }

    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email ja cadastrado');
    }

    const clinic = await this.clinicRepo.save(this.clinicRepo.create({
      name: dto.name,
      cnpj: dto.cnpj,
      responsibleName: dto.responsibleName,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      city: dto.city,
    }));

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.responsibleName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
      role: 'clinic',
      clinicId: clinic.id,
    });
    const saved = await this.userRepo.save(user);

    invite.used = true;
    invite.usedBy = saved.id;
    await this.inviteRepo.save(invite);

    return this.generateToken(saved);
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
        dentistId: user.dentistId,
      },
    };
  }
}
