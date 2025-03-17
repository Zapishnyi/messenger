import { Injectable, NotAcceptableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

import { PostgresConfigType } from '../../configs/envConfigType';
import { IsolationLevelsEnum } from './enums/isolationLevels.enum';
import { isolationLevelsModel } from './model/levels.model';

@Injectable()
export class IsolationLevelService {
  constructor(private readonly configService: ConfigService) {}

  public set() {
    const isolation = plainToInstance(isolationLevelsModel, {
      level:
        this.configService.get<PostgresConfigType>('postgres')!
          .transactionIsolationLevel,
    });
    const isValid = Object.values(IsolationLevelsEnum).includes(
      isolation.level as IsolationLevelsEnum,
    );
    if (!isValid) {
      throw new NotAcceptableException(
        'Isolation level must be: "READ UNCOMMITTED","READ COMMITTED","REPEATABLE READ" or"SERIALIZABLE"',
      );
    }
    return isolation.level as IsolationLevel;
  }
}
