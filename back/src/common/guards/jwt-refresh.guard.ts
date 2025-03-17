import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UserEntity } from '../../database/entities/user.entity';
import { TokenTypeEnum } from '../../modules/auth/enums/token-type.enum';
import { TokenService } from '../../modules/auth/services/token.service';
import { AuthTokensRepository } from '../../modules/repository/services/auth-tokens-repository.service';
import { IsolationLevelService } from '../../modules/transaction-isolation-level/isolation-level.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authTokensRepository: AuthTokensRepository,
    private readonly entityManager: EntityManager,
    private readonly isolationLevel: IsolationLevelService,
  ) {}

  async canActivate(
    context: ExecutionContext /* give access to current request data*/,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refresh = request.get('Authorization')?.split(' ').pop();

    if (!refresh) {
      throw new UnauthorizedException();
    }

    const { user_id, device } = await this.tokenService.verifyToken(
      refresh,
      TokenTypeEnum.REFRESH,
    );
    if (!user_id) {
      throw new UnauthorizedException();
    }
    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em): Promise<void> => {
        const userRepositoryEM = em.getRepository(UserEntity);
        const refreshTokenExist =
          await this.authTokensRepository.isAuthTokenExist(refresh, em);
        if (!refreshTokenExist) {
          throw new UnauthorizedException();
        }

        const user = await userRepositoryEM.findOneBy({
          id: user_id,
        });
        if (!user) {
          throw new UnauthorizedException();
        }
        request.user_data = {
          user,
          device,
        };
      },
    );

    return true;
  }
}
