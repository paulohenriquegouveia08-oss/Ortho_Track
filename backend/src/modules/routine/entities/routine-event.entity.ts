import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Patient } from '../../patients/patient.entity';
import { RoutineItem } from './routine-item.entity';

export type RoutineEventType = 'removed' | 'returned' | 'skipped' | 'dismissed';

@Entity('routine_events')
export class RoutineEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Index()
  @Column({ name: 'routine_item_id', nullable: true })
  routineItemId: string;

  @ManyToOne(() => RoutineItem, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'routine_item_id' })
  routineItem: RoutineItem;

  @Column({ name: 'event_type', length: 20 })
  eventType: RoutineEventType;

  @Column({ name: 'occurred_at', type: 'timestamptz' })
  occurredAt: Date;

  @Column({ name: 'expected_at', type: 'timestamptz', nullable: true })
  expectedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
