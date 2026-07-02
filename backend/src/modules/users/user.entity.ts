import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 255, select: false })
  password: string;

  @Column({ length: 20, default: 'patient' })
  role: string;

  @Column({ nullable: true })
  clinicId: string;

  @Column({ nullable: true })
  dentistId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
