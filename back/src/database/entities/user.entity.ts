import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

import { AuthTokenEntity } from './auth-token.entity';
import { BaseModel } from './base_model/base.model';
import { MessageEntity } from './message.entity';

@Entity('user')
export class UserEntity extends BaseModel {
  @Column('text', { unique: true, nullable: true })
  nick_name: string;

  @Index()
  @Column('text', { unique: true, nullable: false })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('date', { default: null })
  last_visit: Date | null;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'user_contacts',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'contact_id',
      referencedColumnName: 'id',
    },
  })
  contacts: UserEntity[];

  @OneToMany(() => AuthTokenEntity, (entity) => entity.user)
  auth_tokens: AuthTokenEntity[];

  @OneToMany(() => MessageEntity, (entity) => entity.sender)
  messages_sent: MessageEntity[];

  @OneToMany(() => MessageEntity, (entity) => entity.receiver)
  messages_received: MessageEntity[];
}
