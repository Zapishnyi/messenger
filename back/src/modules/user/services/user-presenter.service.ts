import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../../database/entities/user.entity';
import { UserMeResDto } from '../dto/res/user-me.res.dto';
import { UserResDto } from '../dto/res/user.res.dto';

@Injectable()
export class UserPresenterService {
  public toMeResponseDtoFromEntity({
    id,
    nick_name,
    email,
    contacts,
    last_visit,
    created,
    updated,
  }: UserEntity): UserMeResDto {
    return {
      id,
      nick_name,
      email,
      contacts,
      last_visit,
      created,
      updated,
    };
  }
  public toResponseDtoFromEntity({
    id,
    nick_name,
    last_visit,
    created,
    updated,
  }: UserEntity): UserResDto {
    return {
      id,
      nick_name,
      last_visit,
      created,
      updated,
    };
  }
}
