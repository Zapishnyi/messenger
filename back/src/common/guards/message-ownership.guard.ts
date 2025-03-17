import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { MessageEntity } from '../../database/entities/message.entity';
import { IUserData } from '../../modules/auth/interfaces/IUserData';
import { IsolationLevelService } from '../../modules/transaction-isolation-level/isolation-level.service';

@Injectable()
export class MessageOwnershipGuard implements CanActivate {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly isolationLevel: IsolationLevelService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request['user_data'] as IUserData;
    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager): Promise<void> => {
        const massageRepositoryEM = em.getRepository(MessageEntity);
        const message = await massageRepositoryEM.findOne({
          where: {
            id: request.params.id,
            sender_id: user.id,
          },
          relations: ['files'],
        });
        if (!message) {
          throw new UnauthorizedException();
        }
        request.message_data = message;
      },
    );

    return true;
  }
}
