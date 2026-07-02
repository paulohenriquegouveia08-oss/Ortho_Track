import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;
}

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  password: string;

  @IsString()
  phone: string;

  @IsString()
  inviteCode: string;

  @IsOptional()
  @IsString()
  birthDate?: string;
}

export class RegisterClinicDto {
  @IsString()
  name: string;

  @IsString()
  cnpj: string;

  @IsString()
  responsibleName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  inviteCode: string;
}
