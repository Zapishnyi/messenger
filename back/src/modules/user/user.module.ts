import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { IsolationLevelModule } from '../transaction-isolation-level/isolation-level.module';
import { UserService } from './services/user.service';
import { UserPresenterService } from './services/user-presenter.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    RepositoryModule,
    IsolationLevelModule,
  ],
  controllers: [UserController],
  providers: [UserPresenterService, UserService],
  exports: [UserPresenterService, UserService],
})
export class UserModule {}
