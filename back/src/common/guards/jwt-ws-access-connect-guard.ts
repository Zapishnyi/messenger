import { Injectable, UseFilters } from '@nestjs/common';
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
export class JwtWSConnectGuard {
  constructor(
    // private readonly jwtService: JwtService,
    private readonly entityManager: EntityManager,
    private readonly tokenService: TokenService,
    private readonly isolationLevel: IsolationLevelService,
    private readonly authTokensRepository: AuthTokensRepository,
  ) {}
  // ToDo - to make token expiration check with cron disconnection from socket functionality
  public async check(client: Socket): Promise<string | void> {
    let user_id: string;
    const access = Array.isArray(client.handshake.query.token)
      ? client.handshake.query.token[0]
      : client.handshake.query.token;
    try {
      if (!access) {
        throw new WsException('Unauthorized');
      }
      const userData = await this.tokenService.verifyToken(
        access,
        TokenTypeEnum.ACCESS,
      );
      user_id = userData.user_id;
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
            throw new WsException('Unauthorized');
          }
          const userFound = await usersRepositoryEM.findOne({
            where: { id: user_id },
          });
          if (!userFound) {
            throw new WsException('Unauthorized');
          }
        },
      );
    } catch (e) {
      user_id = '';
    }

    return user_id;
  }
}
