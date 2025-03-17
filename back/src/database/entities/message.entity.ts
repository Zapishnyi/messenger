import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseModel } from './base_model/base.model';
import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';

@Entity('message')
export class MessageEntity extends BaseModel {
  @Column('text', { nullable: true })
  content: string;

  @Column('uuid', { nullable: false })
  sender_id: string;

  @ManyToOne(() => UserEntity, (entity) => entity.messages_sent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @Column('uuid', { nullable: false })
  receiver_id: string;

  @ManyToOne(() => UserEntity, (entity) => entity.messages_received, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @OneToMany(() => FileEntity, (entity) => entity.message)
  // @JoinColumn({ name: 'file_id' })
  files: FileEntity[];
}
