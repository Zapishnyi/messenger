import { PickType } from '@nestjs/swagger';

import { UserBaseResDto } from '../base/user-base.res.dto';

export class UserResDto extends PickType(UserBaseResDto, [
  'id',
  'nick_name',
  'email',
  'contacts',
  'last_visit',
  'created',
  'updated',
]) {}
