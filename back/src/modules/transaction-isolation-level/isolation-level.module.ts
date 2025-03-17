import { Module } from '@nestjs/common';

import { IsolationLevelService } from './isolation-level.service';

@Module({
  providers: [IsolationLevelService],
  exports: [IsolationLevelService],
})
export class IsolationLevelModule {}
