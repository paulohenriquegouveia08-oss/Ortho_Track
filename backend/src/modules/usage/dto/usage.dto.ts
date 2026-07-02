import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class UsageEventDto {
  @IsString() @IsNotEmpty() patientId: string;
  @IsString() @IsIn(['USING', 'REMOVED']) type: string;
}
