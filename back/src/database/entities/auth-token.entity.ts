import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseModel } from './base_model/base.model';
import { UserEntity } from './user.entity';

// @Index(['deviceId', 'userId']) /* indexing by several fields*/
@Entity('auth_tokens')
export class AuthTokenEntity extends BaseModel {
  @Column('text', { nullable: false })
  access: string;

  @Column('text', { nullable: false })
  refresh: string;

  @Column('text', { nullable: false })
  device: string;

  @Column('uuid', { nullable: false })
  user_id: string;

  @ManyToOne(() => UserEntity, (entity) => entity.auth_tokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
