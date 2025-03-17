import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FileEntity } from '../../../database/entities/file.entity';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(FileEntity, dataSource.manager);
  }
}
