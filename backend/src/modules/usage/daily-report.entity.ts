import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('daily_reports')
@Index(['patientId', 'date'], { unique: true })
export class DailyReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int', default: 0 })
  totalUsageSeconds: number;

  @Column({ type: 'int', default: 0 })
  totalPauseSeconds: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  adherence: number;

  @Column({ type: 'int', default: 0 })
  longestBreakSeconds: number;

  @Column({ type: 'int', default: 0 })
  breakCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
