import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageController, ReportController } from './usage.controller';
import { UsageService } from './usage.service';
import { UsageEvent } from './usage-event.entity';
import { DailyReport } from './daily-report.entity';
import { Patient } from '../patients/patient.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsageEvent, DailyReport, Patient, User])],
  controllers: [UsageController, ReportController],
  providers: [UsageService],
  exports: [UsageService],
})
export class UsageModule {}
