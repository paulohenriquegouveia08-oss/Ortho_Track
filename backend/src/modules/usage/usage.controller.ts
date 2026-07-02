import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsageService } from './usage.service';
import { UsageEventDto } from './dto/usage.dto';
import { RolesGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('usage')
export class UsageController {
  constructor(private usageService: UsageService) {}

  @Post('event')
  @UseGuards(AuthGuard('jwt'))
  recordEvent(@Body() dto: UsageEventDto) {
    return this.usageService.recordEvent(dto.patientId, dto.type);
  }

  @Get('current-session/:patientId')
  @UseGuards(AuthGuard('jwt'))
  getCurrentSession(@Param('patientId') patientId: string) {
    return this.usageService.getCurrentSession(patientId);
  }

  @Get('today/:patientId')
  @UseGuards(AuthGuard('jwt'))
  getToday(@Param('patientId') patientId: string) {
    return this.usageService.getToday(patientId);
  }

  @Get('week/:patientId')
  @UseGuards(AuthGuard('jwt'))
  getWeek(@Param('patientId') patientId: string) {
    return this.usageService.getWeek(patientId);
  }

  @Get('history/:patientId')
  @UseGuards(AuthGuard('jwt'))
  getHistory(@Param('patientId') patientId: string) {
    return this.usageService.getHistory(patientId);
  }
}

@Controller('report')
export class ReportController {
  constructor(private usageService: UsageService) {}

  @Get(':patientId')
  @UseGuards(AuthGuard('jwt'))
  getReport(@Param('patientId') patientId: string) {
    return this.usageService.getReport(patientId);
  }
}
