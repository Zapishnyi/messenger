import { IsString } from 'class-validator';

export class UserAuthReqDto {
  @IsString()
  public readonly email: string;
  @IsString()
  public readonly password: string;
}
