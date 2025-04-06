import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';
import { UserSearchQueryDto } from '../../user/dto/req/user-search.query.dto';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }
  public async getUsersByQuery(
    { page, sort, search, limit }: UserSearchQueryDto,
    em?: EntityManager,
  ): Promise<UserEntity[]> {
    const repository = em ? em.getRepository(UserEntity) : this;

    try {
      const query = repository
        .createQueryBuilder('user')
        .orderBy('user.created', sort)
        .take(limit) // set limit to 10 if no search query
        .skip((page - 1) * limit); // set offset based on page and limit
      if (search) {
        query.andWhere('user.nick_name ILIKE :search ', {
          search: `%${search}%`,
        });
      }
      return await query.getMany();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
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
