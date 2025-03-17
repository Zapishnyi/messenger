import { PickType } from '@nestjs/swagger';

import { UserBaseReqDto } from '../../../user/dto/base/user-base.req.dto';

export class UserSingUpReqDto extends PickType(UserBaseReqDto, [
  'nick_name',
  'email',
  'password',
]) {}
