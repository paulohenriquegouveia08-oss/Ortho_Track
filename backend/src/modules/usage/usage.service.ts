import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { UsageEvent } from './usage-event.entity';
import { DailyReport } from './daily-report.entity';
import { Patient } from '../patients/patient.entity';
import { User } from '../users/user.entity';

const TIMEZONE = 'America/Sao_Paulo';
const DAILY_GOAL = 22 * 3600;

function getLocalDateOf(date: Date): string {
  return formatInTimeZone(date, TIMEZONE, 'yyyy-MM-dd');
}

function getLocalMidnight(date: Date): Date {
  const dateKey = getLocalDateOf(date);
  return fromZonedTime(`${dateKey}T00:00:00.000`, TIMEZONE);
}

function getLocalEndOfDay(date: Date): Date {
  const dateKey = getLocalDateOf(date);
  return fromZonedTime(`${dateKey}T23:59:59.999`, TIMEZONE);
}

type DailyPortion = {
  date: string;
  seconds: number;
};

function splitIntervalByDays(startMs: number, endMs: number): DailyPortion[] {
  const portions: DailyPortion[] = [];
  let cursorMs = startMs;

  while (cursorMs < endMs) {
    const dayStartMs = getLocalMidnight(new Date(cursorMs)).getTime();
    const dayEndMs = dayStartMs + 86400000;

    const portionStart = Math.max(cursorMs, dayStartMs);
    const portionEnd = Math.min(endMs, dayEndMs);

    if (portionStart < portionEnd) {
      portions.push({
        date: getLocalDateOf(new Date(cursorMs)),
        seconds: Math.floor((portionEnd - portionStart) / 1000),
      });
    }

    cursorMs = dayEndMs;
  }

  return portions;
}

@Injectable()
export class UsageService {
  constructor(
    @InjectRepository(UsageEvent) private eventRepo: Repository<UsageEvent>,
    @InjectRepository(DailyReport) private reportRepo: Repository<DailyReport>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  private async lookupPatient(idOrUserId: string) {
    let patient = await this.patientRepo.findOne({ where: { id: idOrUserId } });
    if (!patient) patient = await this.patientRepo.findOne({ where: { userId: idOrUserId } });
    return patient;
  }

  async recordEvent(patientId: string, type: string, clientTimestamp?: string | Date) {
    const patient = await this.lookupPatient(patientId);
    if (!patient) throw new BadRequestException('Paciente nao encontrado');
    const pid = patient.id;

    const eventDate = clientTimestamp ? new Date(clientTimestamp) : new Date();
    const timeMs = eventDate.getTime();

    // Idempotency: check if identical event was already recorded in ±2s
    let event = await this.eventRepo.findOne({
      where: {
        patientId: pid,
        type,
        timestamp: Between(new Date(timeMs - 2000), new Date(timeMs + 2000)),
      },
    });

    const today = getLocalDateOf(eventDate);

    if (!event) {
      event = await this.eventRepo.save(this.eventRepo.create({
        patientId: pid,
        type,
        timestamp: eventDate,
        date: today,
      }));
    }

    // Determine current status based on the chronologically latest event
    const latestDbEvent = await this.eventRepo.findOne({
      where: { patientId: pid },
      order: { timestamp: 'DESC' },
    });
    const currentStatus = latestDbEvent?.type || type;
    await this.patientRepo.update(pid, { currentStatus });

    const rangeStart = getLocalMidnight(eventDate);
    const now = new Date();
    await this.recalculateDailyReportsForRange(pid, rangeStart, now);

    if (type === 'REMOVED') {
      let report = await this.reportRepo.findOne({ where: { patientId: pid, date: today } });
      if (report) {
        report.breakCount = (report.breakCount || 0) + 1;
        await this.reportRepo.save(report);
      }
    }

    if (type === 'USING') {
      await this.ensureDailyReport(pid, today);
    }

    return { event, currentStatus };
  }

  async syncBatch(
    patientId: string,
    events: Array<{ type: string; timestamp: string; clientEventId?: string }>,
  ) {
    const patient = await this.lookupPatient(patientId);
    if (!patient) throw new BadRequestException('Paciente nao encontrado');
    const pid = patient.id;

    if (!events || events.length === 0) {
      return this.getToday(pid);
    }

    // Sort events chronologically ascending
    const sorted = [...events].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    let earliestDate: Date = new Date();
    const insertedEvents: UsageEvent[] = [];

    for (const item of sorted) {
      const eventDate = new Date(item.timestamp);
      if (isNaN(eventDate.getTime())) continue;

      if (eventDate.getTime() < earliestDate.getTime()) {
        earliestDate = eventDate;
      }

      const timeMs = eventDate.getTime();
      const existing = await this.eventRepo.findOne({
        where: {
          patientId: pid,
          type: item.type,
          timestamp: Between(new Date(timeMs - 2000), new Date(timeMs + 2000)),
        },
      });

      if (!existing) {
        const dateStr = getLocalDateOf(eventDate);
        const created = await this.eventRepo.save(
          this.eventRepo.create({
            patientId: pid,
            type: item.type,
            timestamp: eventDate,
            date: dateStr,
          }),
        );
        insertedEvents.push(created);
      }
    }

    // Recalculate daily reports from earliest affected date to now
    const rangeStart = getLocalMidnight(earliestDate);
    const now = new Date();
    await this.recalculateDailyReportsForRange(pid, rangeStart, now);

    // Update patient status to the latest event in DB
    const latestDbEvent = await this.eventRepo.findOne({
      where: { patientId: pid },
      order: { timestamp: 'DESC' },
    });

    if (latestDbEvent) {
      await this.patientRepo.update(pid, { currentStatus: latestDbEvent.type });
    }

    const todayData = await this.getToday(pid);
    return {
      syncedCount: insertedEvents.length,
      currentStatus: latestDbEvent?.type || patient.currentStatus,
      today: todayData,
    };
  }

  private async ensureDailyReport(patientId: string, today: string) {
    let report = await this.reportRepo.findOne({ where: { patientId, date: today } });
    if (!report) {
      report = this.reportRepo.create({ patientId, date: today, totalUsageSeconds: 0, totalPauseSeconds: 0, adherence: 0, longestBreakSeconds: 0, breakCount: 0 });
      await this.reportRepo.save(report);
    }
  }

  private async setDailyUsage(patientId: string, date: string, totalSeconds: number): Promise<void> {
    let report = await this.reportRepo.findOne({ where: { patientId, date } });
    if (!report) {
      report = this.reportRepo.create({
        patientId, date, totalUsageSeconds: 0, totalPauseSeconds: 0,
        adherence: 0, longestBreakSeconds: 0, breakCount: 0,
      });
    }
    report.totalUsageSeconds = totalSeconds;
    report.adherence = Math.min(Math.round((totalSeconds / DAILY_GOAL) * 10000) / 100, 100);
    await this.reportRepo.save(report);
  }

  private async recalculateDailyReportsForRange(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const events = await this.eventRepo.find({
      where: { patientId },
      order: { timestamp: 'ASC' },
    });

    const beforeStart = new Date(startDate.getTime() - 86400000);
    const relevantEvents = events.filter(e => {
      const ts = e.timestamp.getTime();
      return ts >= beforeStart.getTime() && ts <= endDate.getTime() + 86400000;
    });

    const dailyTotals: Record<string, number> = {};

    if (relevantEvents.length > 0) {
      type Session = { startMs: number; endMs: number | null };
      const sessions: Session[] = [];

      let i = 0;
      while (i < relevantEvents.length) {
        if (relevantEvents[i].type === 'USING') {
          const startMs = relevantEvents[i].timestamp.getTime();
          let endMs: number | null = null;
          for (let j = i + 1; j < relevantEvents.length; j++) {
            if (relevantEvents[j].type === 'REMOVED') {
              endMs = relevantEvents[j].timestamp.getTime();
              i = j + 1;
              break;
            }
          }
          if (endMs === null) {
            endMs = endDate.getTime();
            i = relevantEvents.length;
          }
          sessions.push({ startMs, endMs });
        } else {
          i++;
        }
      }

      for (const session of sessions) {
        const portions = splitIntervalByDays(session.startMs, session.endMs!);
        for (const p of portions) {
          dailyTotals[p.date] = (dailyTotals[p.date] || 0) + p.seconds;
        }
      }
    }

    const startMs = getLocalMidnight(startDate).getTime();
    const endMs = getLocalMidnight(endDate).getTime();
    for (let dayMs = startMs; dayMs <= endMs; dayMs += 86400000) {
      const dateStr = getLocalDateOf(new Date(dayMs));
      const seconds = dailyTotals[dateStr] || 0;
      await this.setDailyUsage(patientId, dateStr, seconds);
    }
  }

  private async reconcileActiveSession(patientId: string): Promise<void> {
    const lastEvent = await this.eventRepo.findOne({
      where: { patientId },
      order: { timestamp: 'DESC' },
    });

    if (!lastEvent || lastEvent.type !== 'USING') return;

    const sessionStart = lastEvent.timestamp;
    const now = new Date();

    const rangeStart = getLocalMidnight(sessionStart);

    await this.recalculateDailyReportsForRange(patientId, rangeStart, now);
  }

  private async recalculateUsageOnRemove(patientId: string, removedAt: Date): Promise<void> {
    const lastUsing = await this.eventRepo.findOne({
      where: { patientId, type: 'USING' },
      order: { timestamp: 'DESC' },
    });
    if (!lastUsing) return;

    const rangeStart = getLocalMidnight(lastUsing.timestamp);
    await this.recalculateDailyReportsForRange(patientId, rangeStart, removedAt);

    const today = getLocalDateOf(removedAt);
    let report = await this.reportRepo.findOne({ where: { patientId, date: today } });
    if (report) {
      report.breakCount = (report.breakCount || 0) + 1;
      await this.reportRepo.save(report);
    }
  }

  async getToday(patientId: string) {
    const patient = await this.lookupPatient(patientId);
    if (!patient) throw new BadRequestException('Paciente nao encontrado');
    const pid = patient.id;

    await this.reconcileActiveSession(pid);

    const today = getLocalDateOf(new Date());
    const report = await this.reportRepo.findOne({ where: { patientId: pid, date: today } });

    let currentSessionElapsed = 0;
    let activeSessionStartedAt: number | null = null;
    if (patient.currentStatus === 'USING') {
      const lastUsing = await this.eventRepo.findOne({
        where: { patientId: pid, type: 'USING' },
        order: { timestamp: 'DESC' },
      });
      if (lastUsing) {
        activeSessionStartedAt = lastUsing.timestamp.getTime();
        currentSessionElapsed = Math.floor((Date.now() - lastUsing.timestamp.getTime()) / 1000);
      }
    }

    const todaySeconds = report?.totalUsageSeconds || 0;
    const adherence = Math.min(Math.round((todaySeconds / DAILY_GOAL) * 10000) / 100, 100);

    return {
      currentStatus: patient.currentStatus,
      todayUsageSeconds: todaySeconds,
      serverNow: new Date().toISOString(),
      activeSessionStartedAt,
      todayPauseSeconds: report?.totalPauseSeconds || 0,
      adherence,
      breakCount: report?.breakCount || 0,
      longestBreakSeconds: report?.longestBreakSeconds || 0,
      currentSessionElapsed,
    };
  }

  async getWeek(patientId: string) {
    await this.reconcileActiveSession(patientId);

    const today = new Date();
    const days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateOf(d);
      const report = await this.reportRepo.findOne({ where: { patientId, date: dateStr } });
      days.push({
        date: dateStr,
        weekday: d.toLocaleDateString('pt-BR', { weekday: 'long' }),
        usageSeconds: report?.totalUsageSeconds || 0,
        pauseSeconds: report?.totalPauseSeconds || 0,
        adherence: report?.adherence || 0,
      });
    }
    return days;
  }

  async getHistory(patientId: string) {
    const patient = await this.lookupPatient(patientId);
    if (!patient) throw new BadRequestException('Paciente nao encontrado');
    const events = await this.eventRepo.find({
      where: { patientId: patient.id },
      order: { timestamp: 'DESC' },
      take: 100,
    });
    return events;
  }

  async getReport(patientId: string) {
    const patient = await this.lookupPatient(patientId);
    if (!patient) throw new BadRequestException('Paciente nao encontrado');
    const pid = patient.id;
    const [today, week, history] = await Promise.all([
      this.getToday(pid),
      this.getWeek(pid),
      this.getHistory(pid),
    ]);

    let dentist: { name: string; email: string } | null = null;
    if (patient.dentistId) {
      const dentistUser = await this.userRepo.findOne({
        where: { id: patient.dentistId },
        select: ['id', 'name', 'email'],
      });
      if (dentistUser) {
        dentist = { name: dentistUser.name, email: dentistUser.email };
      }
    }

    const weekUsage = week.map(d => d.usageSeconds);
    const avgSeconds = weekUsage.length > 0 ? weekUsage.reduce((a, b) => a + b, 0) / weekUsage.length : 0;
    const avgAdherence = Math.min(Math.round((avgSeconds / DAILY_GOAL) * 10000) / 100, 100);
    const bestDay = week.reduce((best, d) => d.usageSeconds > (best?.usageSeconds || 0) ? d : best, week[0]);
    const worstDay = week.reduce((worst, d) => d.usageSeconds < (worst?.usageSeconds || 0) ? d : worst, week[0]);

    let risk: string;
    let feedback: string;
    if (avgAdherence >= 90) {
      risk = 'Baixo';
      feedback = 'Excelente aderencia. Continue mantendo essa rotina.';
    } else if (avgAdherence >= 75) {
      risk = 'Medio';
      feedback = 'Atencao: sua media esta abaixo da meta. Tente reduzir o tempo sem uso.';
    } else {
      risk = 'Alto';
      feedback = 'Risco de atraso no tratamento. Use o alinhador por mais tempo diariamente.';
    }

    const pauses = history
      .filter((e, i, arr) => e.type === 'REMOVED' && i + 1 < arr.length && arr[i + 1].type === 'USING')
      .map(e => ({
        start: e.timestamp,
        duration: today.todayPauseSeconds,
      }));

    return {
      patientId: pid,
      currentStatus: patient.currentStatus,
      dentist,
      today: {
        usageSeconds: today.todayUsageSeconds,
        pauseSeconds: today.todayPauseSeconds,
        adherence: today.adherence,
        breakCount: today.breakCount,
        longestBreakSeconds: today.longestBreakSeconds,
      },
      weekly: {
        avgSeconds,
        avgAdherence,
        days: week,
        bestDay: bestDay ? { date: bestDay.date, usageSeconds: bestDay.usageSeconds } : null,
        worstDay: worstDay ? { date: worstDay.date, usageSeconds: worstDay.usageSeconds } : null,
      },
      risk,
      feedback,
      pauses,
    };
  }

  async getCurrentSession(patientId: string) {
    const patient = await this.lookupPatient(patientId);
    if (!patient) throw new BadRequestException('Paciente nao encontrado');
    const pid = patient.id;
    const today = getLocalDateOf(new Date());

    const lastUsing = await this.eventRepo.findOne({
      where: { patientId: pid, type: 'USING' },
      order: { timestamp: 'DESC' },
    });

    const isActive = patient.currentStatus === 'USING' && lastUsing &&
      getLocalDateOf(lastUsing.timestamp) <= today;

    const elapsed = isActive && lastUsing
      ? Math.floor((Date.now() - lastUsing.timestamp.getTime()) / 1000)
      : 0;

    const todayData = await this.getToday(pid);

    return {
      active: isActive,
      currentStatus: patient.currentStatus,
      sessionStart: lastUsing?.timestamp?.getTime() || null,
      elapsed: isActive ? elapsed : 0,
      todaySeconds: todayData.todayUsageSeconds,
      serverNow: new Date().toISOString(),
    };
  }
}
