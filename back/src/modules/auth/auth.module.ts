import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtWSConnectGuard } from '../../common/guards/jwt-ws-access-connect-guard';
import { RepositoryModule } from '../repository/repository.module';
import { IsolationLevelModule } from '../transaction-isolation-level/isolation-level.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    RepositoryModule,
    JwtModule,
    forwardRef(() => UserModule),
    IsolationLevelModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtWSConnectGuard],
  exports: [AuthService, TokenService, JwtWSConnectGuard],
})
export class AuthModule {}
