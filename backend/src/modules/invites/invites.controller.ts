import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvitesService } from './invites.service';
import { ValidateInviteDto } from './dto/invite.dto';
import { RolesGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateClinicDto } from '../clinics/dto/clinic.dto';

@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @Post('validate')
  validate(@Body() dto: ValidateInviteDto) {
    return this.invitesService.validate(dto.code);
  }
}

@Controller('clinic/invites')
export class ClinicInvitesController {
  constructor(private invitesService: InvitesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLINIC)
  @Post('dentist')
  async createDentistInvite(@CurrentUser() user: any) {
    const code = await this.invitesService.generateForClinic(user.clinicId, 'dentist');
    return { code };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLINIC)
  @Post('patient')
  async createPatientInvite(@CurrentUser() user: any) {
    const code = await this.invitesService.generateForDoctor(user.clinicId, 'patient');
    return { code };
  }
}
