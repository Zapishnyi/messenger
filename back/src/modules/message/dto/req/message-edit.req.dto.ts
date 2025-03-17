import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class MessageEditReqDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Transform(TransformHelper.trim)
  @ApiProperty({
    description: 'New message content',
    format: 'string',
  })
  public readonly content?: string;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @IsUUID('all', { each: true })
  @ApiProperty({
    description: 'List of file UUIDs to delete',
    type: 'string',
    format: 'uuid',
    isArray: true,
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      'c56a4180-65aa-42ec-a945-5fd21dec0538',
    ],
  })
  public readonly filesToDelete?: string[];
}
