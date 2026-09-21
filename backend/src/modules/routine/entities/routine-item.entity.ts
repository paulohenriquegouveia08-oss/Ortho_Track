import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PatientRoutine } from './patient-routine.entity';

export type RoutineItemType = 'meal' | 'snack' | 'hygiene' | 'other';

@Entity('routine_items')
export class RoutineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'routine_id' })
  routineId: string;

  @ManyToOne(() => PatientRoutine, (routine) => routine.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routine_id' })
  routine: PatientRoutine;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20, default: 'meal' })
  type: RoutineItemType;

  @Column({ name: 'start_time', length: 5 })
  startTime: string; // "HH:mm"

  @Column({ name: 'expected_duration_minutes', type: 'int', default: 30 })
  expectedDurationMinutes: number;

  @Column({ default: true })
  enabled: boolean;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
