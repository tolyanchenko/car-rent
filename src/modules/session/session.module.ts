import { Module } from '@nestjs/common';
import { SessionsService } from './session.service';
import { SessionsController } from './session.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../db/db.module';
import { SessionRepository } from './repos/session.repo';
import { RateRepository } from './repos/rate.repo';
import { databaseProviders } from '../db/db.providers';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    SessionRepository,
    RateRepository,
    ...databaseProviders,
  ],
})
export class SessionsModule {}
