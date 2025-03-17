import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { MessageEntity } from '../../../database/entities/message.entity';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(MessageEntity, dataSource.manager);
  }

  public async getMessageOfFile(
    user_id: string,
    file_id: string,
    em?: EntityManager,
  ): Promise<MessageEntity | null> {
    const repository = em ? em.getRepository(MessageEntity) : this;
    try {
      return await repository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.files', 'file')
        .where(
          '(message.receiver_id = :userId OR message.sender_id = :userId)',
          { userId: user_id },
        )
        .andWhere('file.id = :fileId', { fileId: file_id })
        .getOne();
    } catch (err) {
      throw new Error(err);
    }
  }
}
