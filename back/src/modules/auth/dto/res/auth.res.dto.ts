import { UserResDto } from '../../../user/dto/res/user.res.dto';
import { AuthTokenPairResDto } from './auth-tokens-pair.res.dto';

export class AuthResDto {
  tokens: AuthTokenPairResDto;
  user: UserResDto;
}
