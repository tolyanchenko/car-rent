import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/db.module';
import { databaseProviders } from '../db/db.providers';
import { SessionRepository } from '../session/repos/session.repo';
import { SessionsModule } from '../session/session.module';
import { CarController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [DatabaseModule, SessionsModule],
  controllers: [CarController],
  providers: [ReportService, SessionRepository, ...databaseProviders],
  exports: [ReportService],
})
export class ReportModule {}
