import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { FileEntity } from '../../../database/entities/file.entity';
import { MessageEntity } from '../../../database/entities/message.entity';
import { MessageRepository } from '../../repository/services/message-repository.service';
import { IsolationLevelService } from '../../transaction-isolation-level/isolation-level.service';
import { MessageEditReqDto } from '../dto/req/message-edit.req.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly isolationLevel: IsolationLevelService,
    private readonly entityManager: EntityManager,
  ) {}
  public async getMessages(
    initiator_id: string,
    opponent_id: string,
  ): Promise<MessageEntity[]> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const messageRepositoryEM = em.getRepository(MessageEntity);
        return await messageRepositoryEM.find({
          where: [
            { receiver_id: opponent_id, sender_id: initiator_id },
            { receiver_id: initiator_id, sender_id: opponent_id },
          ],
          relations: ['files'],
        });
      },
    );
  }

  public async editMessage({
    id,
    content,
    filesToDelete,
  }: MessageEditReqDto): Promise<MessageEntity> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const messageRepositoryEM = em.getRepository(MessageEntity);
        const fileRepositoryEM = em.getRepository(FileEntity);
        if (content) {
          messageRepositoryEM.update({ id }, { content });
        }
        if (filesToDelete?.length) {
          filesToDelete.forEach(async (file) => {
            fileRepositoryEM.delete({ id: file });
          });
        }
        const messageUpdated = await messageRepositoryEM.findOne({
          where: {
            id,
          },
          relations: ['files'],
        });
        if (!messageUpdated) {
          throw new NotFoundException('Message not exist');
        }
        return messageUpdated;
      },
    );
  }
  public async deleteMessage(message_id: string): Promise<void> {
    await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const messageRepositoryEM = em.getRepository(MessageEntity);
        await messageRepositoryEM.delete({ id: message_id });
      },
    );
  }
}
