import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async isEmailExist(
    email: string,
    em?: EntityManager,
  ): Promise<boolean> {
    const repository = em ? em.getRepository(UserEntity) : this;
    return await repository.exists({
      where: { email },
    });
  }

  public async isNickNameExist(
    nick_name: string,
    em?: EntityManager,
  ): Promise<boolean> {
    const repository = em ? em.getRepository(UserEntity) : this;
    return await repository.exists({
      where: { nick_name },
    });
  }
}
