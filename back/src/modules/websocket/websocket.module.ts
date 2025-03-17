import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { IsolationLevelModule } from '../transaction-isolation-level/isolation-level.module';
import { ChatGateWay } from './gateways/chat.gateway';

@Module({
  imports: [RepositoryModule, IsolationLevelModule, AuthModule],
  controllers: [],
  providers: [ChatGateWay],
})
export class WebSocketModule {}
