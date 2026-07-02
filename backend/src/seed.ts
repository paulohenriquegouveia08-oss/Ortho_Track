import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './modules/users/user.entity';
import { Clinic } from './modules/clinics/clinic.entity';
import { Patient } from './modules/patients/patient.entity';
import { Invite } from './modules/invites/invite.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userRepo = app.get(getRepositoryToken(User));
  const clinicRepo = app.get(getRepositoryToken(Clinic));
  const patientRepo = app.get(getRepositoryToken(Patient));
  const inviteRepo = app.get(getRepositoryToken(Invite));

  const hash = await bcrypt.hash('admin123', 10);
  const hashSimple = await bcrypt.hash('123456', 10);

  // Admins
  await userRepo.upsert(
    { name: 'Admin OrthoTrack', email: 'admin@orthotrack.com', password: hash, role: 'admin', isActive: true },
    ['email'],
  );
  await userRepo.upsert(
    { name: 'Admin OrthoTrack 2', email: 'orthotrack10@gmail.com', password: hash, role: 'admin', isActive: true },
    ['email'],
  );

  // Clinics
  const clinic1 = await clinicRepo.save(clinicRepo.create({
    name: 'Ortho Prime Londrina',
    responsibleName: 'Carlos Almeida',
    email: 'carlos@orthoprime.com',
    phone: '4332765200',
    city: 'Londrina - PR',
    address: 'Rua Taperucu, 165',
  }));

  const clinic2 = await clinicRepo.save(clinicRepo.create({
    name: 'OdontoCenter Sao Paulo',
    responsibleName: 'Juliana Costa',
    email: 'juliana@odontocenter.com',
    phone: '1132765200',
    city: 'Sao Paulo - SP',
    address: 'Av Paulista, 1000',
  }));

  // Pre-defined invites
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  await inviteRepo.upsert(
    { code: 'CLINICA-2026', type: 'clinic', expiresAt, used: false },
    ['code'],
  );

  // Dentists (vinculados a Ortho Prime)
  const dentist1 = await userRepo.save(userRepo.create({
    name: 'Dra. Camila Ferreira', email: 'camila@orthoprime.com',
    password: hashSimple, role: 'dentist', clinicId: clinic1.id, isActive: true,
  }));
  const dentist2 = await userRepo.save(userRepo.create({
    name: 'Dr. Rafael Mendes', email: 'rafael@orthoprime.com',
    password: hashSimple, role: 'dentist', clinicId: clinic1.id, isActive: true,
  }));

  await inviteRepo.upsert(
    { code: 'DENTISTA-2026', type: 'dentist', clinicId: clinic1.id, expiresAt, used: false },
    ['code'],
  );

  // Patients
  const patientData = [
    { name: 'Joao Silva', email: 'joao@email.com' },
    { name: 'Maria Oliveira', email: 'maria@email.com' },
    { name: 'Pedro Santos', email: 'pedro@email.com' },
    { name: 'Ana Clara', email: 'ana@email.com' },
    { name: 'Lucas Pereira', email: 'lucas@email.com' },
    { name: 'Fernanda Lima', email: 'fernanda@email.com' },
    { name: 'Rafael Costa', email: 'rafael.c@email.com' },
    { name: 'Bianca Martins', email: 'bianca@email.com' },
  ];

  for (const pd of patientData) {
    const user = await userRepo.save(userRepo.create({
      name: pd.name, email: pd.email,
      password: hashSimple, role: 'patient', clinicId: clinic1.id, dentistId: dentist1.id, isActive: true,
    }));
    await patientRepo.save(patientRepo.create({
      userId: user.id,
      clinicId: clinic1.id,
      dentistId: dentist1.id,
      currentStatus: Math.random() > 0.5 ? 'USING' : 'REMOVED',
    }));
  }

  await inviteRepo.upsert(
    { code: 'PACIENTE-2026', type: 'patient', clinicId: clinic1.id, dentistId: dentist1.id, expiresAt, used: false },
    ['code'],
  );

  // Dentist invite for OdontoCenter
  await inviteRepo.upsert(
    { code: 'DENTISTA-SP', type: 'dentist', clinicId: clinic2.id, expiresAt, used: false },
    ['code'],
  );

  console.log('Seed concluido com sucesso!');
  console.log('  Admin 1: admin@orthotrack.com / admin123');
  console.log('  Admin 2: orthotrack10@gmail.com / admin123');
  console.log('  Clinicas: Ortho Prime Londrina + OdontoCenter SP');
  console.log('  Dentistas: Dra. Camila + Dr. Rafael');
  console.log('  Pacientes: 8 pacientes vinculados a Dra. Camila');
  console.log('  Convites: CLINICA-2026, DENTISTA-2026, PACIENTE-2026, DENTISTA-SP');

  await app.close();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
