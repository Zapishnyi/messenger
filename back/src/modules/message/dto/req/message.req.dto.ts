import { IsNotEmpty, IsUUID } from 'class-validator';

export class MessageReqDto {
  @IsUUID()
  @IsNotEmpty()
  opponent_id: string;
}
