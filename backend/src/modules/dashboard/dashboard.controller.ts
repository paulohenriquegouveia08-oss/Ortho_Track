import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('admin/dashboard')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }

  @Get('dentist/dashboard')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DENTIST)
  getDentistDashboard(@CurrentUser() user: any) {
    return this.dashboardService.getDentistDashboard(user.id);
  }

  @Get('dentist/patients')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.DENTIST)
  getPatients(@CurrentUser() user: any) {
    return this.dashboardService.getDentistPatients(user.id);
  }
}
