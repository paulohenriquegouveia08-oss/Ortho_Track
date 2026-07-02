import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { PatientsModule } from './modules/patients/patients.module';
import { InvitesModule } from './modules/invites/invites.module';
import { UsageModule } from './modules/usage/usage.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AppVersionModule } from './modules/app-version/app-version.module';
import { DevDashboardModule } from './modules/dev-dashboard/dev-dashboard.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    AuthModule,
    UsersModule,
    ClinicsModule,
    PatientsModule,
    InvitesModule,
    UsageModule,
    DashboardModule,
    AppVersionModule,
    DevDashboardModule,
  ],
})
export class AppModule {}
