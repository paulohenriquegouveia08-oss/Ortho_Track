import { IsString, IsNotEmpty } from 'class-validator';

export class CreateClinicDto {
  @IsString() @IsNotEmpty() name: string;
}

export class CreateInviteDto {
  @IsString() @IsNotEmpty() type: string;
  @IsString() name: string;
  @IsString() email: string;
}
