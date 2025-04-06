import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { MessageEntity } from '../../../../database/entities/message.entity';
import IContact from '../../interfaces/IContact';

export class UserBaseResDto {
  @ApiProperty({ description: 'User ID', format: 'uuid' })
  readonly id: string;

  @ApiProperty({
    description: 'User first name',
    format: 'string',
    minLength: 1,
    maxLength: 25,
    example: 'John',
  })
  readonly nick_name: string;

  @ApiProperty({
    description: 'User email',
    format: 'email',
    minLength: 3,
    maxLength: 100,
    example: 'john.doe@example.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Date and time when user left chat',
    example: new Date(),
  })
  readonly last_visit: Date | null;

  @ApiProperty({
    description: 'Date nad time when user created',
    example: new Date(),
  })
  readonly created: Date;

  @ApiProperty({
    description: 'Date nad time when user updated',
    example: new Date(),
  })
  readonly updated: Date;

  @Optional()
  @ApiProperty({
    description: 'Contacts ID list of user',
    example: [],
  })
  readonly contacts: IContact[];

  @Optional()
  @ApiProperty({
    description: 'Messages owned',
    example: [],
  })
  readonly messages_sent?: MessageEntity[];

  @Optional()
  @ApiProperty({
    description: 'Messages received',
    example: [],
  })
  readonly messages_received?: MessageEntity[];
}
