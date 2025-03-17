import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseModel } from './base_model/base.model';
import { MessageEntity } from './message.entity';

@Entity('file')
export class FileEntity extends BaseModel {
  @Column()
  filename: string;

  @Column('bytea')
  filedata: Buffer;

  @Column()
  mimetype: string;

  @ManyToOne(() => MessageEntity, (entity) => entity.files, {
    onDelete: 'CASCADE',
  })
  message: MessageEntity;
}
