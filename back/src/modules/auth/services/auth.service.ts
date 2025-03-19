import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';

import { EnvConfigType } from '../../../configs/envConfigType';
import { AuthTokenEntity } from '../../../database/entities/auth-token.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { IsolationLevelService } from '../../transaction-isolation-level/isolation-level.service';
import { UserService } from '../../user/services/user.service';
import { UserSignInReqDto } from '../dto/req/user-sign-in.req.dto';
import { UserSingUpReqDto } from '../dto/req/user-sing-up.req.dto';
import { AuthTokenPairResDto } from '../dto/res/auth-tokens-pair.res.dto';
import { IUserData } from '../interfaces/IUserData';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly entityManager: EntityManager,
    private readonly envConfig: ConfigService<EnvConfigType>,
    private readonly isolationLevel: IsolationLevelService,
    private readonly userService: UserService,
  ) {}

  private async generateSaveAuthTokens(
    user_id: string,
    device: string,
    em: EntityManager,
  ): Promise<AuthTokenPairResDto> {
    const authTokensRepositoryEM = em.getRepository(AuthTokenEntity);
    const tokens = await this.tokenService.generateAuthTokens({
      user_id,
      device,
    });

    await authTokensRepositoryEM.save(
      authTokensRepositoryEM.create({
        device,
        access: tokens.access,
        refresh: tokens.refresh,
        user_id,
      }),
    );

    return tokens;
  }

  private async deleteAuthTokens(
    user_id: string,
    device: string,
    em: EntityManager,
  ) {
    const authTokensRepositoryEM = em.getRepository(AuthTokenEntity);
    // delete previously issued refresh and access tokens
    await authTokensRepositoryEM.delete({
      device,
      user_id,
    });
  }

  // Sign in ---------------------------------------------
  public async signIn(
    dto: UserSignInReqDto,
    request: Request,
  ): Promise<[UserEntity, AuthTokenPairResDto]> {
    const device = request.headers['user-agent'];
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager): Promise<[UserEntity, AuthTokenPairResDto]> => {
        Logger.log('sign in service fired');
        const usersRepositoryEM = em.getRepository(UserEntity);
        const user = await usersRepositoryEM.findOne({
          where: { email: dto.email },
          select: [
            'id',
            'email',
            'nick_name',
            'password',
            'last_visit',
            'created',
            'updated',
          ],
          relations: ['contacts'],
        });
        // Is user exist, password exist and active and not banned ?
        if (!user) {
          throw new UnauthorizedException();
        }
        // Is password valid?
        const isPasswordValid = await bcrypt.compare(
          dto.password,
          user.password,
        );
        if (!isPasswordValid) {
          throw new UnauthorizedException();
        }
        // delete previously issued refresh and access Tokens
        await this.deleteAuthTokens(user.id, device, em);
        const tokens = await this.generateSaveAuthTokens(user.id, device, em);
        return [user, tokens];
      },
    );
  }

  // Sing up ---------------------------------------------
  public async singUp(dto: UserSingUpReqDto): Promise<UserEntity> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager): Promise<UserEntity> => {
        await this.userService.isUserNotExistOrThrow(dto.email, em);
        await this.userService.isNickNameNotExistOrThrow(dto.nick_name, em);
        const userRepositoryEM = em.getRepository(UserEntity);
        const password = await bcrypt.hash(dto.password, 10);
        return await userRepositoryEM.save(
          userRepositoryEM.create({
            ...dto,
            password,
          }),
        );
      },
    );
  }
  // Refresh tokens --------------------------------------------
  public async refresh({
    user,
    device,
  }: IUserData): Promise<AuthTokenPairResDto> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        await this.deleteAuthTokens(user.id, device, em);
        return await this.generateSaveAuthTokens(user.id, device, em);
      },
    );
  }
  // Sign out logged user--------------------------------------------
  public async signOut({ user, device }: IUserData): Promise<void> {
    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager): Promise<void> => {
        await this.deleteAuthTokens(user.id, device, em);
      },
    );
  }

  // Delete logged user --------------------------------------------
  public async deleteMe(user_id: string, { device }: IUserData): Promise<void> {
    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em) => {
        const usersRepositoryEM = em.getRepository(UserEntity);
        await usersRepositoryEM.delete({ id: user_id });
        await this.deleteAuthTokens(user_id, device, em);
      },
    );
  }
}
