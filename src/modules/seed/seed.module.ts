import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../db/db.module';
import { SeedService } from './seed.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
