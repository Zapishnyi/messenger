import { UserMeResDto } from '../../../user/dto/res/user-me.res.dto';
import { AuthTokenPairResDto } from './auth-tokens-pair.res.dto';

export class AuthResDto {
  tokens: AuthTokenPairResDto;
  user: UserMeResDto;
}
