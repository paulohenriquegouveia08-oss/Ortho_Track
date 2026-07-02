import { Controller, Get, Res, Inject } from '@nestjs/common';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Patient } from '../patients/patient.entity';
import { Clinic } from '../clinics/clinic.entity';

@Controller('dev')
export class DevDashboardController {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Clinic) private clinicRepo: Repository<Clinic>,
  ) {}

  @Get('users')
  async listUsers() {
    const users = await this.userRepo.find({ select: ['id', 'name', 'email', 'password', 'phone', 'role', 'clinicId', 'dentistId', 'isActive', 'createdAt'] });
    return users.map(u => ({
      ...u,
      createdAt: u.createdAt?.toISOString?.() ?? u.createdAt,
    }));
  }

  @Get()
  async dashboardPage(@Res() res: Response) {
    const users = await this.userRepo.find({ select: ['id', 'name', 'email', 'password', 'phone', 'role', 'clinicId', 'dentistId', 'isActive', 'createdAt'] });
    const patients = await this.patientRepo.find();
    const clinics = await this.clinicRepo.find();

    const usersHtml = users.map(u => {
      const patient = patients.find(p => p.userId === u.id);
      const clinic = clinics.find(c => c.id === u.clinicId);
      return `<tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td style="font-family:monospace;color:#e06c75">${u.password}</td>
        <td><span class="badge badge-${u.role}">${u.role}</span></td>
        <td>${patient ? `<span class="badge badge-patient">sim</span>` : '-'}</td>
        <td>${clinic?.name || '-'}</td>
        <td style="font-size:0.75rem;color:#999">${u.id.slice(0,8)}…</td>
      </tr>`;
    }).join('');

    const html = `<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OrthoTrack — Dev Dashboard</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; background:#1e1e2e; color:#cdd6f4; padding:2rem; }
    h1 { font-size:1.5rem; margin-bottom:0.25rem; }
    .subtitle { color:#6c7086; margin-bottom:1.5rem; font-size:0.85rem; }
    table { width:100%; border-collapse:collapse; background:#181825; border-radius:8px; overflow:hidden; }
    th, td { padding:0.6rem 0.8rem; text-align:left; border-bottom:1px solid #313244; }
    th { background:#11111b; font-weight:600; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; color:#6c7086; }
    tr:hover td { background:#1e1e2e; }
    .badge { display:inline-block; padding:0.15rem 0.5rem; border-radius:4px; font-size:0.7rem; font-weight:600; text-transform:uppercase; }
    .badge-patient { background:#313244; color:#cdd6f4; }
    .badge-admin { background:#f38ba8; color:#1e1e2e; }
    .badge-dentist { background:#89b4fa; color:#1e1e2e; }
    .badge-clinic { background:#a6e3a1; color:#1e1e2e; }
    .counts { display:flex; gap:1rem; margin-bottom:1.5rem; }
    .count-card { background:#181825; border-radius:8px; padding:0.8rem 1.2rem; }
    .count-card .number { font-size:1.5rem; font-weight:700; }
    .count-card .label { font-size:0.75rem; color:#6c7086; }
  </style>
</head>
<body>
  <h1>🧪 Dev Dashboard</h1>
  <p class="subtitle">Todos os usuários do OrthoTrack — senhas visíveis (ambiente de desenvolvimento)</p>

  <div class="counts">
    <div class="count-card"><div class="number">${users.length}</div><div class="label">usuários</div></div>
    <div class="count-card"><div class="number">${patients.length}</div><div class="label">pacientes</div></div>
    <div class="count-card"><div class="number">${clinics.length}</div><div class="label">clínicas</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Senha</th>
        <th>Role</th>
        <th>Paciente</th>
        <th>Clínica</th>
        <th>ID</th>
      </tr>
    </thead>
    <tbody>
      ${usersHtml}
    </tbody>
  </table>
</body>
</html>`;
    res.type('html').send(html);
  }
}
