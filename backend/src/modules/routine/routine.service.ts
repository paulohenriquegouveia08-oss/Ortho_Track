import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientRoutine } from './entities/patient-routine.entity';
import { RoutineItem } from './entities/routine-item.entity';
import { RoutineEvent } from './entities/routine-event.entity';
import { Patient } from '../patients/patient.entity';
import {
  CreateRoutineDto,
  CreateRoutineItemDto,
  UpdateRoutineDto,
  UpdateRoutineItemDto,
  RecordRoutineEventDto,
} from './dto/routine.dto';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(PatientRoutine)
    private routineRepo: Repository<PatientRoutine>,
    @InjectRepository(RoutineItem)
    private itemRepo: Repository<RoutineItem>,
    @InjectRepository(RoutineEvent)
    private eventRepo: Repository<RoutineEvent>,
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  private async lookupPatient(idOrUserId: string): Promise<Patient> {
    let patient = await this.patientRepo.findOne({ where: { id: idOrUserId } });
    if (!patient) {
      patient = await this.patientRepo.findOne({ where: { userId: idOrUserId } });
    }
    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }
    return patient;
  }

  async getPatientRoutine(idOrUserId: string) {
    const patient = await this.lookupPatient(idOrUserId);
    const routine = await this.routineRepo.findOne({
      where: { patientId: patient.id },
      relations: ['items'],
    });

    if (!routine) {
      return {
        hasRoutine: false,
        routine: null,
      };
    }

    // Ordena os itens por horário de início
    if (routine.items) {
      routine.items.sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.startTime.localeCompare(b.startTime);
      });
    }

    return {
      hasRoutine: true,
      routine,
    };
  }

  async createOrReplaceRoutine(idOrUserId: string, dto: CreateRoutineDto) {
    const patient = await this.lookupPatient(idOrUserId);

    let routine = await this.routineRepo.findOne({
      where: { patientId: patient.id },
      relations: ['items'],
    });

    if (routine) {
      // Remove itens anteriores para substituir pelos novos
      if (routine.items && routine.items.length > 0) {
        await this.itemRepo.remove(routine.items);
      }
      routine.enabled = dto.enabled !== undefined ? dto.enabled : true;
      routine = await this.routineRepo.save(routine);
    } else {
      routine = this.routineRepo.create({
        patientId: patient.id,
        enabled: dto.enabled !== undefined ? dto.enabled : true,
      });
      routine = await this.routineRepo.save(routine);
    }

    // Cria novos itens
    const itemsToSave = (dto.items || []).map((itemDto, index) =>
      this.itemRepo.create({
        routineId: routine.id,
        name: itemDto.name.trim(),
        type: itemDto.type || 'meal',
        startTime: itemDto.startTime,
        expectedDurationMinutes: itemDto.expectedDurationMinutes,
        enabled: itemDto.enabled !== undefined ? itemDto.enabled : true,
        sortOrder: itemDto.sortOrder !== undefined ? itemDto.sortOrder : index,
      }),
    );

    const savedItems = await this.itemRepo.save(itemsToSave);
    savedItems.sort((a, b) => a.startTime.localeCompare(b.startTime));

    routine.items = savedItems;
    return {
      hasRoutine: true,
      routine,
    };
  }

  async updateRoutineStatus(idOrUserId: string, dto: UpdateRoutineDto) {
    const patient = await this.lookupPatient(idOrUserId);
    const routine = await this.routineRepo.findOne({
      where: { patientId: patient.id },
      relations: ['items'],
    });

    if (!routine) {
      throw new NotFoundException('Rotina não encontrada para este paciente');
    }

    if (dto.enabled !== undefined) {
      routine.enabled = dto.enabled;
      await this.routineRepo.save(routine);
    }

    return this.getPatientRoutine(patient.id);
  }

  async addRoutineItem(idOrUserId: string, dto: CreateRoutineItemDto) {
    const patient = await this.lookupPatient(idOrUserId);
    let routine = await this.routineRepo.findOne({
      where: { patientId: patient.id },
      relations: ['items'],
    });

    if (!routine) {
      routine = await this.routineRepo.save(
        this.routineRepo.create({
          patientId: patient.id,
          enabled: true,
        }),
      );
      routine.items = [];
    }

    const sortOrder =
      dto.sortOrder !== undefined
        ? dto.sortOrder
        : routine.items ? routine.items.length : 0;

    const newItem = this.itemRepo.create({
      routineId: routine.id,
      name: dto.name.trim(),
      type: dto.type || 'meal',
      startTime: dto.startTime,
      expectedDurationMinutes: dto.expectedDurationMinutes,
      enabled: dto.enabled !== undefined ? dto.enabled : true,
      sortOrder,
    });

    const saved = await this.itemRepo.save(newItem);
    return saved;
  }

  async updateRoutineItem(
    idOrUserId: string,
    itemId: string,
    dto: UpdateRoutineItemDto,
  ) {
    const patient = await this.lookupPatient(idOrUserId);
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['routine'],
    });

    if (!item) {
      throw new NotFoundException('Refeição não encontrada');
    }

    if (item.routine.patientId !== patient.id) {
      throw new ForbiddenException('Acesso negado a esta rotina');
    }

    if (dto.name !== undefined) item.name = dto.name.trim();
    if (dto.type !== undefined) item.type = dto.type;
    if (dto.startTime !== undefined) item.startTime = dto.startTime;
    if (dto.expectedDurationMinutes !== undefined)
      item.expectedDurationMinutes = dto.expectedDurationMinutes;
    if (dto.enabled !== undefined) item.enabled = dto.enabled;
    if (dto.sortOrder !== undefined) item.sortOrder = dto.sortOrder;

    return this.itemRepo.save(item);
  }

  async deleteRoutineItem(idOrUserId: string, itemId: string) {
    const patient = await this.lookupPatient(idOrUserId);
    const item = await this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['routine'],
    });

    if (!item) {
      throw new NotFoundException('Refeição não encontrada');
    }

    if (item.routine.patientId !== patient.id) {
      throw new ForbiddenException('Acesso negado a esta rotina');
    }

    await this.itemRepo.remove(item);
    return { success: true, message: 'Refeição removida com sucesso' };
  }

  async recordEvent(idOrUserId: string, dto: RecordRoutineEventDto) {
    const patient = await this.lookupPatient(idOrUserId);

    const occurredAt = dto.occurredAt ? new Date(dto.occurredAt) : new Date();
    const expectedAt = dto.expectedAt ? new Date(dto.expectedAt) : undefined;

    const event = this.eventRepo.create({
      patientId: patient.id,
      routineItemId: dto.routineItemId || undefined,
      eventType: dto.eventType,
      occurredAt,
      expectedAt,
      metadata: dto.metadata || undefined,
    });

    return this.eventRepo.save(event);
  }

  async getEvents(idOrUserId: string, limit = 50) {
    const patient = await this.lookupPatient(idOrUserId);
    return this.eventRepo.find({
      where: { patientId: patient.id },
      relations: ['routineItem'],
      order: { occurredAt: 'DESC' },
      take: Math.min(limit, 100),
    });
  }
}
