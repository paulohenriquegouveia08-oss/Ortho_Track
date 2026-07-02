import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  clinicId: string;

  @Column({ nullable: true })
  dentistId: string;

  @Column({ type: 'date', nullable: true })
  birthDate: string;

  @Column({ type: 'date', nullable: true })
  treatmentStartDate: string;

  @Column({ length: 20, default: 'REMOVED' })
  currentStatus: string;

  @CreateDateColumn()
  createdAt: Date;
}
