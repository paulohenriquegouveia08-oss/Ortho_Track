# OrthoTrack — Contexto do Sistema

> **Ultima atualizacao**: 19/06/2026
> **Proximo relatorio**: ao final de cada fase de implementacao

---

## Instrucao Obrigatoria: Relatorio de Implementacao

**A CADA implementacao realizada, um relatorio deve ser gerado e anexado neste documento, na secao "Relatorios de Implementacao".**

O relatorio deve conter:
1. **Fase/Modulo implementado**
2. **Data da implementacao**
3. **O que foi feito** (resumo tecnico)
4. **Arquivos criados/modificados**
5. **Decisoes tecnicas tomadas**
6. **Problemas encontrados e solucoes**
7. **Status dos testes**
8. **Proximos passos**

Esta instrucao permanece vigente para todas as implementacoes futuras.

---

## 1. Visao Geral

OrthoTrack e uma plataforma HealthTech para acompanhamento de pacientes que utilizam alinhadores removiveis (Invisalign, aparelhos transparentes). O sistema permite:

- Registro manual de uso do alinhador (USING / REMOVED)
- Calculo automatico de horas de uso, pausas, aderencia
- Dashboard do paciente com feedback visual por cor
- Dashboard do dentista com status dos pacientes em tempo real
- Gerenciamento de clinicas, dentistas e pacientes via convites
- Relatorios diarios, semanais e historico completo

---

## 2. Stack Tecnologica

| Componente | Tecnologia | Versao | Porta |
|-----------|-----------|--------|-------|
| Backend | NestJS + TypeORM | — | 3004 |
| Banco | PostgreSQL 16 | 16 | 5435 |
| Cache (opcional) | Redis | 7 | 6381 |
| Frontend | Expo SDK 52 + Expo Router | — | — |
| Auth | JWT (bcrypt + jsonwebtoken) | — | — |
| Deploy | Docker Compose na VPS | — | — |

**VPS**: `137.131.233.254` — usuario `ubuntu`, chave `~/Downloads/oracle-final`

---

## 3. Identidade Visual

### Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#0D9488` | Teal — header, botoes principais, marca |
| `primaryLight` | `#14B8A6` | Backgrounds, cards selecionados |
| `accent` | `#F97316` | Laranja — CTAs, destaques |
| `surface` | `#F8FAFC` | Background geral |
| `card` | `#FFFFFF` | Cards, modais |
| `text` | `#0F172A` | Titulos |
| `subtext` | `#64748B` | Labels, descricoes |
| `success` | `#10B981` | Verde saude — EM USO, aderencia boa |
| `warning` | `#F59E0B` | Ambar — aderencia media |
| `danger` | `#EF4444` | Vermelho — FORA DE USO, risco alto |

### Fontes

- iOS: SF Pro (sistema)
- Android: Roboto (sistema)

### Logo

Nome "OrthoTrack" em teal `#0D9488` + icone de dois arcos entrelacados representando alinhador + dente.

---

## 4. Arquitetura de Pastas

```
/Users/adrianotavares/Documents/Projetos PK Digital/
  OrthoTrack/
    SYSTEM_CONTEXT.md
    backend/
      src/
        main.ts
        app.module.ts
        config/
          database.config.ts
          jwt.config.ts
        common/
          guards/
          decorators/
          enums/
        modules/
          auth/
          users/
          clinics/
          patients/
          invites/
          usage/
          dashboard/
      docker-compose.yml
      Dockerfile
      package.json
      tsconfig.json
      .env
      seed.ts
    mobile/
      app.json
      package.json
      tsconfig.json
      babel.config.js
      app/
        _layout.tsx
        index.tsx
        (auth)/
          _layout.tsx
          login.tsx
          invite.tsx
          register-clinic.tsx
          register-patient.tsx
        (admin)/
          _layout.tsx
          index.tsx
          clinics.tsx
        (clinic)/
          _layout.tsx
          index.tsx
          invites.tsx
          users.tsx
        (dentist)/
          _layout.tsx
          index.tsx
          patients.tsx
          patient/[id].tsx
        (patient)/
          _layout.tsx
          monitor.tsx
          index.tsx
          report.tsx
          history.tsx
          profile.tsx
      src/
        components/
        services/
        types/
        utils/
        theme/
```

---

## 5. Entidades do Banco (PostgreSQL)

### users
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | |
| name | VARCHAR(255) | |
| email | VARCHAR(255) UNIQUE | |
| phone | VARCHAR(20) | |
| password | VARCHAR(255) | bcrypt hash |
| role | ENUM('admin','clinic','dentist','patient') | |
| clinic_id | UUID FK → clinics.id | nullable |
| dentist_id | UUID FK → users.id | nullable |
| is_active | BOOLEAN | default true |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### clinics
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | |
| name | VARCHAR(255) | |
| cnpj | VARCHAR(18) | nullable |
| responsible_name | VARCHAR(255) | |
| email | VARCHAR(255) | |
| phone | VARCHAR(20) | |
| address | TEXT | |
| city | VARCHAR(100) | |
| plan | VARCHAR(50) | 'basic' |
| status | VARCHAR(20) | 'active' |
| created_at | TIMESTAMPTZ | |

### patients
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | |
| user_id | UUID FK → users.id | UNIQUE |
| clinic_id | UUID FK → clinics.id | |
| dentist_id | UUID FK → users.id | |
| birth_date | DATE | nullable |
| treatment_start_date | DATE | nullable |
| current_status | ENUM('USING','REMOVED') | default 'REMOVED' |
| created_at | TIMESTAMPTZ | |

### usage_events
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | |
| patient_id | UUID FK → patients.id | |
| type | ENUM('USING','REMOVED','AUTO_RESET') | |
| timestamp | TIMESTAMPTZ | |
| date | DATE | |
| created_at | TIMESTAMPTZ | |

### daily_reports
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | |
| patient_id | UUID FK → patients.id | |
| date | DATE | UNIQUE(patient_id, date) |
| total_usage_seconds | INT | |
| total_pause_seconds | INT | |
| adherence | DECIMAL(5,2) | 0.00 a 100.00 |
| longest_break_seconds | INT | |
| break_count | INT | |

### invites
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | UUID PK | |
| code | VARCHAR(20) UNIQUE | |
| type | ENUM('clinic','dentist','patient') | |
| clinic_id | UUID FK → clinics.id | nullable |
| dentist_id | UUID FK → users.id | nullable |
| used | BOOLEAN | default false |
| used_by | UUID FK → users.id | nullable |
| expires_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |

---

## 6. Endpoints da API

### Auth
```
POST /auth/login       → { token, user }
POST /auth/register    → { token, user }
```

### Invites
```
POST /invites/validate → { type, clinicId, dentistId }
```

### Admin
```
GET  /admin/dashboard  → { totalClinics, totalPatients, activeClinics }
POST /admin/clinics    → cria clinica + gera invite code
GET  /admin/clinics    → lista clinicas
```

### Clinic
```
GET  /clinic/dashboard       → { patientsActive, dentists, avgAdherence }
POST /clinic/invites/dentist → gera convite dentista
POST /clinic/invites/patient → gera convite paciente
GET  /clinic/users           → lista dentistas + pacientes
```

### Usage
```
POST /usage/event              → { patientId, type: USING|REMOVED }
GET  /usage/today/:patientId   → { secondsUsed, events[], status }
GET  /usage/week/:patientId    → { days: [{date, seconds, pauses}] }
GET  /usage/history/:patientId → { events[] }
```

### Dentist
```
GET /dentist/dashboard    → { patients, stats }
GET /dentist/patients     → pacientes com status
GET /dentist/patients/:id → detalhes + relatorio
```

### Reports
```
GET /report/:patientId → { daily, weekly, adherence, risk }
```

---

## 7. Regras de Negocio

### Meta Diaria
22 horas por dia (79.200 segundos)

### Calculo de Aderencia
```
aderencia = min(secondsUsed / 79200 * 100, 100)
```

### Classificacao de Risco
| Nivel | Criterio |
|-------|----------|
| Baixo | aderencia >= 90% |
| Medio | aderencia >= 75% e < 90% |
| Alto | aderencia < 75% |

### Feedback por Uso Diario
| Cor | Criterio | Mensagem |
|-----|----------|----------|
| Verde | >= 21h30 | "Excelente! Voce esta muito proximo da meta ideal." |
| Amarelo | >= 18h e < 21h30 | "Atencao: tente usar um pouco mais o alinhador." |
| Vermelho | < 18h | "Uso muito abaixo do recomendado. Recoloque o alinhador." |

### Virada do Dia (00:00)
- Fecha daily_report do dia anterior
- Cria novo daily_report zerado
- Se paciente estava EM USO → cria USING auto as 00:00
- Se estava FORA DE USO → mantem sem acao

### Fluxo de Eventos
```
USING → (tempo passando) → REMOVED → (pausa) → USING → ...
```

---

## 8. Perfis de Usuario

### Admin Global
- Dashboard com estatisticas de todas as clinicas
- Criar novas clinicas
- Gerar convites de clinica
- Visualizar lista de clinicas

### Clinica
- Entra via codigo de convite gerado pelo Admin
- Preenche cadastro
- Dashboard com pacientes ativos, dentistas, aderencia media
- Gera convites para dentistas e pacientes

### Dentista
- Criado via convite da clinica
- Dashboard com pacientes e status em tempo real
- Lista de pacientes com cor de risco
- Detalhes do paciente com grafico e timeline

### Paciente
- Criado via convite da clinica/dentista
- Monitoramento com cronometro e botoes USING/REMOVED
- Dashboard pessoal com horas, aderencia, feedback
- Relatorio semanal com grafico de barras
- Historico completo de eventos

---

## 9. Estrutura do Frontend (Expo Router)

```
app/
  _layout.tsx        ← Root: verifica token, redireciona

  index.tsx          ← Se logado → redirect ao dashboard certo
                       Se nao logado → redirect a (auth)/login

  (auth)/
    _layout.tsx      ← Stack: login, invite, register
    login.tsx        ← Email/senha + botoes quick profile
    invite.tsx       ← Input codigo convite
    register-clinic.tsx
    register-patient.tsx

  (admin)/
    _layout.tsx      ← Stack + role guard
    index.tsx        ← Dashboard admin
    clinics.tsx      ← Lista + criar clinica

  (clinic)/
    _layout.tsx
    index.tsx        ← Dashboard clinica
    invites.tsx      ← Gerar convites
    users.tsx        ← Lista usuarios

  (dentist)/
    _layout.tsx
    index.tsx        ← Dashboard dentista
    patients.tsx     ← Lista pacientes
    patient/[id].tsx ← Detalhes paciente

  (patient)/
    _layout.tsx      ← Bottom tabs (4 abas)
    monitor.tsx      ← Cronometro + USING/REMOVED
    index.tsx        ← Dashboard paciente
    report.tsx       ← Relatorio semanal
    history.tsx      ← Historico eventos
    profile.tsx      ← Dados pessoais
```

---

## 10. Seed Inicial

### Admin
- `admin@orhtotrack.com` / `admin123` — Admin Global

### Clinicas
- `Ortho Prime Londrina` — responsavel: Carlos Almeida
- `OdontoCenter Sao Paulo` — responsavel: Juliana Costa

### Dentistas (vinculados a Ortho Prime)
- `camila@orthoprime.com` / `123456` — Dra. Camila Ferreira
- `rafael@orthoprime.com` / `123456` — Dr. Rafael Mendes

### Pacientes (vinculados a Ortho Prime + Dra. Camila)
- `joao@email.com` / `123456` — Joao Silva
- `maria@email.com` / `123456` — Maria Oliveira
- `pedro@email.com` / `123456` — Pedro Santos
- `ana@email.com` / `123456` — Ana Clara
- `lucas@email.com` / `123456` — Lucas Pereira
- `fernanda@email.com` / `123456` — Fernanda Lima
- `rafael.c@email.com` / `123456` — Rafael Costa
- `bianca@email.com` / `123456` — Bianca Martins

### Convites pre-definidos (para demonstracao)
- `CLINICA-2026` → tipo clinic
- `DENTISTA-2026` → tipo dentist (vinculado a Ortho Prime)
- `PACIENTE-2026` → tipo patient (vinculado a Ortho Prime + Dra. Camila)

---
## 11. Relatorios de Implementacao

---

## Relatorio 1 — 19/06/2026

### Modulo: Backend (NestJS + PostgreSQL) + Frontend Mobile (Expo)
### Status: Concluido

### O que foi feito
- Criacao completa do backend NestJS com 7 modulos (Auth, Users, Clinics, Patients, Invites, Usage, Dashboard)
- Criacao de todas as entidades TypeORM (User, Clinic, Patient, UsageEvent, DailyReport, Invite)
- Autenticacao JWT com guards por role (admin, clinic, dentist, patient)
- Sistema de convites (invite codes) para registro de clinicas, dentistas e pacientes
- Endpoints de uso (USING/REMOVED) com calculo de aderencia, pausas, daily reports
- Dashboards por perfil (admin, clinic, dentist, patient)
- Relatorio semanal com classificacao de risco e feedback
- Seed inicial com 1 admin, 2 clinicas, 2 dentistas, 8 pacientes, 4 invites pre-definidos
- Frontend Expo com todas as telas implementadas (auth, admin, clinic, dentist, patient)
- Cronometro do paciente com estado USING/REMOVED
- Componentes visuais com paleta teal/orange HealthTech

### Deploy
- Docker Compose configurado (orthotrack-db:5435, orthotrack-api:3004)
- Build e deploy realizado na VPS Oracle (137.131.233.254)
- Iptables configurado para porta 3004 com persistencia (iptables-persistent)
- Porta 3004 liberada no Security List da Oracle Cloud

### Arquivos criados/modificados
- `backend/` — projeto NestJS completo (30+ arquivos)
- `mobile/` — projeto Expo completo (25+ arquivos de tela/componentes)
- `SYSTEM_CONTEXT.md` — este documento
- `backend/docker-compose.yml` — configuracao Docker
- `backend/Dockerfile` — build em Node 20 Alpine

### Decisoes tecnicas
- Backend-first: toda a logica de calculo de aderencia e riscos no servidor
- TypeORM synchronize:true (dev) — auto-cria tabelas
- JWT com expiracao de 7 dias
- API prefix /api para todas as rotas
- Patient entity separada de User (userId FK)
- DailyReport atualizado a cada evento de uso via upsert
- Expo Router com file-based routing para navegacao
- API_BASE configurada via expo-constants extra

### Problemas encontrados e solucoes
- Porta 3004 bloqueada pelo firewall Oracle Cloud → usuario abriu manualmente no Security List
- Seed nao criava usuario clinic_admin → fluxo de registro via invite code (CLINICA-2026) e o mecanismo correto
- pacote expo-asset faltando → instalado com `npx expo install expo-asset`
- @expo/ngrok necessario para tunnel → instalado globalmente

### Testes
- Todos os endpoints testados via curl:
  - `POST /api/auth/login` — admin, dentist, patient → 200/201
  - `GET /api/admin/dashboard` — retorna 2 clinicas, 8 pacientes, 2 dentistas
  - `GET /api/dentist/patients` — retorna 8 pacientes com risk badges
  - `POST /api/usage/event` — USING/REMOVED registrado com sucesso
  - `GET /api/usage/today/:id` — retorna uso diario
  - `GET /api/usage/week/:id` — retorna 7 dias com aderencia
  - `GET /api/report/:id` — retorna feedback + pausas + risco
  - `POST /api/invites/validate` — PACIENTE-2026 valido
  - `POST /api/auth/register` — cadastro via invite funcional
  - `POST /api/auth/register-clinic` — cadastro clinica via CLINICA-2026 funcional
  - `GET /api/clinic/dashboard` — retorna stats da clinica

### Proximos passos
1. Rodar mobile app no dispositivo fisico via `npx expo start --tunnel`
2. Testar fluxo completo: login admin → criar clinica → convidar dentista → convidar paciente → monitoramento
3. Gerar relatorio de implementacao futura

---
