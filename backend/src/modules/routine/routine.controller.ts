import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoutineService } from './routine.service';
import {
  CreateRoutineDto,
  CreateRoutineItemDto,
  UpdateRoutineDto,
  UpdateRoutineItemDto,
  RecordRoutineEventDto,
} from './dto/routine.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('routine')
@UseGuards(AuthGuard('jwt'))
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Get('me')
  getMyRoutine(@CurrentUser('id') userId: string) {
    return this.routineService.getPatientRoutine(userId);
  }

  @Post()
  createRoutine(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRoutineDto,
  ) {
    return this.routineService.createOrReplaceRoutine(userId, dto);
  }

  @Patch()
  updateRoutineStatus(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateRoutineDto,
  ) {
    return this.routineService.updateRoutineStatus(userId, dto);
  }

  @Post('items')
  addItem(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateRoutineItemDto,
  ) {
    return this.routineService.addRoutineItem(userId, dto);
  }

  @Put('items/:itemId')
  updateItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateRoutineItemDto,
  ) {
    return this.routineService.updateRoutineItem(userId, itemId, dto);
  }

  @Delete('items/:itemId')
  deleteItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.routineService.deleteRoutineItem(userId, itemId);
  }

  @Post('events')
  recordEvent(
    @CurrentUser('id') userId: string,
    @Body() dto: RecordRoutineEventDto,
  ) {
    return this.routineService.recordEvent(userId, dto);
  }

  @Get('events')
  getEvents(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
  ) {
    const take = limit ? parseInt(limit, 10) : 50;
    return this.routineService.getEvents(userId, take);
  }

  // Permite dentista/clínica consultar a rotina de um paciente específico
  @Get('patient/:patientId')
  getPatientRoutine(@Param('patientId') patientId: string) {
    return this.routineService.getPatientRoutine(patientId);
  }
}
