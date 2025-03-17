import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import { TransformHelper } from '../../../common/helpers/transform.helper';
import { IsolationLevelsEnum } from '../enums/isolationLevels.enum';

export class isolationLevelsModel {
  @IsString()
  @Transform(TransformHelper.trim)
  @IsEnum(IsolationLevelsEnum, {
    message:
      'Isolation level must be: "READ UNCOMMITTED","READ COMMITTED","REPEATABLE READ" or"SERIALIZABLE"',
  })
  public readonly level: IsolationLevelsEnum;
}
