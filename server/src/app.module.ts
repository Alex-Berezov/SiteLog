import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { WorkTypesModule } from './work-types/work-types.module';
import { WorkLogsModule } from './work-logs/work-logs.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [PrismaModule, WorkTypesModule, WorkLogsModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
