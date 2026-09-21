import {
  IsString,
  IsNotEmpty,
  IsEnum,
  Matches,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoutineItemType } from '../entities/routine-item.entity';
import { RoutineEventType } from '../entities/routine-event.entity';

export class CreateRoutineItemDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da refeição é obrigatório' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsOptional()
  @IsEnum(['meal', 'snack', 'hygiene', 'other'], {
    message: 'Tipo inválido. Deve ser meal, snack, hygiene ou other',
  })
  type?: RoutineItemType;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Horário deve estar no formato HH:mm (ex: 07:30)',
  })
  startTime: string;

  @IsInt({ message: 'A duração deve ser um número inteiro' })
  @Min(1, { message: 'A duração mínima é de 1 minuto' })
  @Max(360, { message: 'A duração máxima é de 360 minutos' })
  expectedDurationMinutes: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateRoutineDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineItemDto)
  items: CreateRoutineItemDto[];

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateRoutineDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateRoutineItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEnum(['meal', 'snack', 'hygiene', 'other'])
  type?: RoutineItemType;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Horário deve estar no formato HH:mm (ex: 07:30)',
  })
  startTime?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(360)
  expectedDurationMinutes?: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class RecordRoutineEventDto {
  @IsOptional()
  @IsString()
  routineItemId?: string;

  @IsEnum(['removed', 'returned', 'skipped', 'dismissed'], {
    message: 'eventType deve ser removed, returned, skipped ou dismissed',
  })
  eventType: RoutineEventType;

  @IsOptional()
  @IsDateString()
  occurredAt?: string;

  @IsOptional()
  @IsDateString()
  expectedAt?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
