import { IsString, IsNotEmpty, IsIn, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UsageEventDto {
  @IsString() @IsNotEmpty() patientId: string;
  @IsString() @IsIn(['USING', 'REMOVED']) type: string;
  @IsOptional() @IsString() timestamp?: string;
  @IsOptional() @IsString() clientEventId?: string;
}

export class BatchSyncItemDto {
  @IsString() @IsIn(['USING', 'REMOVED']) type: string;
  @IsString() @IsNotEmpty() timestamp: string;
  @IsOptional() @IsString() clientEventId?: string;
}

export class BatchSyncUsageDto {
  @IsString() @IsNotEmpty() patientId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BatchSyncItemDto)
  events: BatchSyncItemDto[];
}
