import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ length: 20 })
  type: string;

  @Column({ nullable: true })
  clinicId: string;

  @Column({ nullable: true })
  dentistId: string;

  @Column({ default: false })
  used: boolean;

  @Column({ nullable: true })
  usedBy: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
