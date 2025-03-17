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
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authTokensRepository: AuthTokensRepository,
    private readonly isolationLevel: IsolationLevelService,
    private readonly entityManager: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const access = request.get('Authorization')?.split(' ').pop();

    if (!access) {
      throw new UnauthorizedException();
    }

    const { user_id, device } = await this.tokenService.verifyToken(
      access,
      TokenTypeEnum.ACCESS,
    );
    if (!user_id) {
      throw new UnauthorizedException();
    }

    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager): Promise<void> => {
        const usersRepositoryEM = em.getRepository(UserEntity);
        const accessTokenExist =
          await this.authTokensRepository.isAuthTokenExist(access, em);
        if (!accessTokenExist) {
          throw new UnauthorizedException();
        }

        const userFound = await usersRepositoryEM.findOne({
          where: { id: user_id },
        });
        if (!userFound) {
          throw new UnauthorizedException();
        }
        request.user_data = {
          user: userFound,
          device,
        };
      },
    );

    return true;
  }
}
