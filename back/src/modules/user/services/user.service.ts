import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';
import { UsersRepository } from '../../repository/services/users-repository.service';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}
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

  // Get all users list--------------------------------------------------------
  public async getAllUsers(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }
}
