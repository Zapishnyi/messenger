import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { AuthTokenEntity } from '../../../database/entities/auth-token.entity';

@Injectable()
export class AuthTokensRepository extends Repository<AuthTokenEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AuthTokenEntity, dataSource.manager);
  }

  public async isAuthTokenExist(
    token: string,
    em?: EntityManager,
  ): Promise<boolean> {
    const repository = em ? em.getRepository(AuthTokenEntity) : this;
    return await repository.exists({
      where: [{ refresh: token }, { access: token }],
    });
  }
}
