import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../users/user.entity';
import { Clinic } from '../clinics/clinic.entity';
import { Patient } from '../patients/patient.entity';
import { DailyReport } from '../usage/daily-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Clinic, Patient, DailyReport])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
