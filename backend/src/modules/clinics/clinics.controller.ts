import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/clinic.dto';
import { RolesGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class ClinicsController {
  constructor(private clinicsService: ClinicsService) {}

  @Get('admin/clinics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.clinicsService.findAll();
  }

  @Get('admin/clinics/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.clinicsService.findByIdDetailed(id);
  }

  @Post('admin/clinics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateClinicDto) {
    return this.clinicsService.create(dto);
  }

  @Get('clinic/dashboard')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLINIC)
  getDashboard(@CurrentUser() user: any) {
    return this.clinicsService.getDashboard(user.clinicId);
  }

  @Get('clinic/users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLINIC)
  getUsers(@CurrentUser() user: any) {
    return this.clinicsService.getUsers(user.clinicId);
  }

  @Post('clinic/dentists/:dentistId/link-patient')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLINIC)
  linkPatient(
    @CurrentUser() user: any,
    @Param('dentistId') dentistId: string,
    @Body('patientId') patientId: string,
  ) {
    return this.clinicsService.linkPatientToDentist(user.clinicId, dentistId, patientId);
  }

  @Delete('clinic/dentists/:dentistId/unlink-patient/:patientId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CLINIC)
  unlinkPatient(
    @CurrentUser() user: any,
    @Param('dentistId') dentistId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.clinicsService.unlinkPatientFromDentist(user.clinicId, dentistId, patientId);
  }
}
