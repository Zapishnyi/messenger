import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseFilters,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EntityManager } from 'typeorm';

import { UserEntity } from '../../database/entities/user.entity';
import { TokenTypeEnum } from '../../modules/auth/enums/token-type.enum';
import { TokenService } from '../../modules/auth/services/token.service';
import { AuthTokensRepository } from '../../modules/repository/services/auth-tokens-repository.service';
import { IsolationLevelService } from '../../modules/transaction-isolation-level/isolation-level.service';
import { GlobalWSExceptionFilter } from '../filters/global-ws-exemption.filter';

@Injectable()
@UseFilters(new GlobalWSExceptionFilter())
export class JwtWSGuard implements CanActivate {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly tokenService: TokenService,
    private readonly isolationLevel: IsolationLevelService,
    private readonly authTokensRepository: AuthTokensRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const access_ws = Array.isArray(client.handshake.query.token)
      ? client.handshake.query.token[0]
      : client.handshake.query.token;
    const access_http = Array.isArray(client.handshake.headers['access-token'])
      ? client.handshake.headers['access-token'][0]
      : client.handshake.headers['access-token'];
    const access = access_ws || access_http;

    if (!access) {
      throw new WsException('Unauthorized');
    }
    const { user_id } = await this.tokenService.verifyToken(
      access,
      TokenTypeEnum.ACCESS,
    );
    if (!user_id) {
      throw new WsException('Unauthorized');
    }
    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager): Promise<void> => {
        const usersRepositoryEM = em.getRepository(UserEntity);
        const accessTokenExist =
          await this.authTokensRepository.isAuthTokenExist(access, em);
        if (!accessTokenExist) {
          // throw new UnauthorizedException();
          throw new WsException('Unauthorized');
        }
        const userFound = await usersRepositoryEM.findOne({
          where: { id: user_id },
        });
        if (!userFound) {
          // throw new UnauthorizedException();
          throw new WsException('Unauthorized');
        }
        client.data.user_id = { user_id };
      },
    );

    return true;
  }
}
