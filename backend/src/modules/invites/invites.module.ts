import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitesController, ClinicInvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { Invite } from './invite.entity';
import { Clinic } from '../clinics/clinic.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invite, Clinic, User])],
  controllers: [InvitesController, ClinicInvitesController],
  providers: [InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}
