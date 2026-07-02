import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../modules/users/user.entity';
import { Clinic } from '../modules/clinics/clinic.entity';
import { Patient } from '../modules/patients/patient.entity';
import { UsageEvent } from '../modules/usage/usage-event.entity';
import { DailyReport } from '../modules/usage/daily-report.entity';
import { Invite } from '../modules/invites/invite.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'orthotrack',
  password: process.env.DB_PASSWORD || 'orthotrack123',
  database: process.env.DB_NAME || 'orthotrack',
  entities: [User, Clinic, Patient, UsageEvent, DailyReport, Invite],
  synchronize: true,
  logging: false,
});
