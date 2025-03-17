import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GlobalHTTPExceptionFilter } from '../common/filters/global-http-exemption.filter';
import { AuthModule } from './auth/auth.module';
import { EnvConnectionModule } from './env-connection/env-connection.module';
import { HealthModule } from './health/health.module';
import { MessageModule } from './message/message.module';
import { PostgresModule } from './postgres/postgres.module';
import { RepositoryModule } from './repository/repository.module';
import { IsolationLevelModule } from './transaction-isolation-level/isolation-level.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    MessageModule,
    WebSocketModule,
    EnvConnectionModule,
    HealthModule,
    RepositoryModule,
    AuthModule,
    IsolationLevelModule,
    PostgresModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalHTTPExceptionFilter,
    },
  ],
})
export class AppModule {}
