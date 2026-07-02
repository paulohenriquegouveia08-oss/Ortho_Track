import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevDashboardController } from './dev-dashboard.controller';
import { User } from '../users/user.entity';
import { Patient } from '../patients/patient.entity';
import { Clinic } from '../clinics/clinic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Patient, Clinic])],
  controllers: [DevDashboardController],
})
export class DevDashboardModule {}
