import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
import { UserResDto } from '../dto/res/user.res.dto';

@Injectable()
export class UserPresenterService {
  public toResponseDtoFromEntity({
    id,
    nick_name,
    email,
    contacts,
    last_visit,
    created,
    updated,
  }: UserEntity): UserResDto {
    return {
      id,
      nick_name,
      email,
      contacts: contacts?.length ? contacts.map((e) => e.id) : [],
      last_visit,
      created,
      updated,
    };
  }
}
