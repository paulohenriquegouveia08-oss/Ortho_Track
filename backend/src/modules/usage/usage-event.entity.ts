import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('usage_events')
@Index(['patientId', 'date'])
export class UsageEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ length: 20 })
  type: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'date' })
  date: string;

  @CreateDateColumn()
  createdAt: Date;
}
