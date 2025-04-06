import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { SortEnum } from '../../enums/SortEnum';

export class UserSearchQueryDto {
  @Transform(TransformHelper.toNumber)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ description: 'Page', default: 1, required: false })
  public readonly page: number = 1;

  @Transform(TransformHelper.toNumber)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({
    description: 'Quantity of records on the page',
    default: 25,
    required: false,
  })
  public readonly limit: number = 25;

  @Transform(TransformHelper.trim)
  @IsNotEmpty()
  @IsEnum(SortEnum)
  @IsOptional()
  @ApiProperty({
    description: 'Sorted order',
    default: SortEnum.ASC,
    required: false,
  })
  public readonly sort: SortEnum = SortEnum.ASC;

  @IsOptional()
  @Transform(TransformHelper.trim)
  @ApiProperty({
    description: 'Name',
    required: false,
    // example: 'Joe',
  })
  readonly search?: string;
}
