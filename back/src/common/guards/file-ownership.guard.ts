import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { IUserData } from '../../modules/auth/interfaces/IUserData';
import { MessageRepository } from '../../modules/repository/services/message-repository.service';
import { IsolationLevelService } from '../../modules/transaction-isolation-level/isolation-level.service';

@Injectable()
export class FileOwnershipGuard implements CanActivate {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly entityManager: EntityManager,
    private readonly isolationLevel: IsolationLevelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request['user_data'] as IUserData;
    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager): Promise<void> => {
        const message = await this.messageRepository.getMessageOfFile(
          user.id,
          request.params.id,
          em,
        );
        if (!message) {
          throw new UnauthorizedException();
        }
      },
    );

    return true;
  }
}
