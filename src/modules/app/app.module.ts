import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from '../report/report.module';
import { SeedModule } from '../seed/seed.module';
import { SessionsModule } from '../session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ReportModule,
    SeedModule,
    SessionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
