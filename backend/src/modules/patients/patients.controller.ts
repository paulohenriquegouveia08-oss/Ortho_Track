import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from './patients.service';
import { RolesGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('dentist/patients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.DENTIST)
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get(':id')
  getDetails(@Param('id') id: string) {
    return this.patientsService.getPatientDetails(id);
  }
}
