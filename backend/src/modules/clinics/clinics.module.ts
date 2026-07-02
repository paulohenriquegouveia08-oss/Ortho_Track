import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicsController } from './clinics.controller';
import { ClinicsService } from './clinics.service';
import { Clinic } from './clinic.entity';
import { User } from '../users/user.entity';
import { Patient } from '../patients/patient.entity';
import { Invite } from '../invites/invite.entity';
import { DailyReport } from '../usage/daily-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, User, Patient, Invite, DailyReport])],
  controllers: [ClinicsController],
  providers: [ClinicsService],
  exports: [ClinicsService],
})
export class ClinicsModule {}
