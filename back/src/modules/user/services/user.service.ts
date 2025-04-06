import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';
import { UsersRepository } from '../../repository/services/users-repository.service';
import { IsolationLevelService } from '../../transaction-isolation-level/isolation-level.service';
import { UserSearchQueryDto } from '../dto/req/user-search.query.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly entityManager: EntityManager,
    private readonly isolationLevel: IsolationLevelService,
  ) {}
  // Is user not exist--------------------------------------------------------
  public async isUserNotExistOrThrow(
    email: string,
    em?: EntityManager,
  ): Promise<void> {
    if (await this.usersRepository.isEmailExist(email, em)) {
      throw new ConflictException('User is already exists');
    }
  }

  // Is user exist--------------------------------------------------------
  public async isUserExistOrThrow(
    email: string,
    em?: EntityManager,
  ): Promise<void> {
    if (!(await this.usersRepository.isEmailExist(email, em))) {
      throw new UnauthorizedException('User is not exists');
    }
  }

  // Is nick name not exist--------------------------------------------------------
  public async isNickNameNotExistOrThrow(
    nick_name: string,
    em?: EntityManager,
  ): Promise<void> {
    if (await this.usersRepository.isNickNameExist(nick_name, em)) {
      throw new ConflictException('Nick name is already exists');
    }
  }
  // Get User by ID --------------------------------------------------------
  public async getUserById(user_id: string): Promise<UserEntity> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const userRepositoryEM = em.getRepository(UserEntity);
        const user = await userRepositoryEM.findOne({ where: { id: user_id } });
        if (!user) {
          throw new NotFoundException('User is not exists');
        }
        return user;
      },
    );
  }

  // Get users list by query--------------------------------------------------------
  public async getUsersByQuery(
    query: UserSearchQueryDto,
  ): Promise<UserEntity[]> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        return await this.usersRepository.getUsersByQuery(query, em);
      },
    );
  }

  // Add contact--------------------------------------------------------
  public async addContact(
    user: UserEntity,
    contact_id: string,
  ): Promise<UserEntity> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const usersRepositoryEM = em.getRepository(UserEntity);
        const newContact = await usersRepositoryEM.findOne({
          where: { id: contact_id },
        });
        if (!newContact) {
          throw new NotFoundException('Contact is not exists');
        }
        return await usersRepositoryEM.save({
          ...user,
          contacts: [...user.contacts, newContact],
        });
      },
    );
  }

  // Delete contact--------------------------------------------------------
  public async deleteContact(
    user: UserEntity,
    contact_id: string,
  ): Promise<UserEntity> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const usersRepositoryEM = em.getRepository(UserEntity);
        return await usersRepositoryEM.save({
          ...user,
          contacts: user.contacts.filter((e) => e.id !== contact_id),
        });
      },
    );
  }
}
