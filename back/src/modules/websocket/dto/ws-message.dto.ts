import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TransformHelper } from '../../../common/helpers/transform.helper';
import IFile from '../../message/interfaces/IFile';

export class MessageDto {
  @IsUUID()
  @IsNotEmpty()
  sender_id: string;

  @IsUUID()
  @IsNotEmpty()
  receiver_id: string;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  files?: IFile[];

  @IsString()
  @IsOptional()
  content?: string;

  @Transform(TransformHelper.toDate)
  @IsNotEmpty()
  @IsDate()
  created: Date;
}
