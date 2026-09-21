import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRoutine } from './entities/patient-routine.entity';
import { RoutineItem } from './entities/routine-item.entity';
import { RoutineEvent } from './entities/routine-event.entity';
import { Patient } from '../patients/patient.entity';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientRoutine,
      RoutineItem,
      RoutineEvent,
      Patient,
    ]),
  ],
  controllers: [RoutineController],
  providers: [RoutineService],
  exports: [RoutineService],
})
export class RoutineModule {}
