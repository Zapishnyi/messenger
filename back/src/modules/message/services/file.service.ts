import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { FileEntity } from '../../../database/entities/file.entity';
import { IsolationLevelService } from '../../transaction-isolation-level/isolation-level.service';

@Injectable()
export class FileService {
  constructor(
    private readonly isolationLevel: IsolationLevelService,
    private readonly entityManager: EntityManager,
  ) {}

  public async uploadFile(files: Express.Multer.File[]): Promise<FileEntity[]> {
    const newFiles = files.map((file) => {
      const newFile = new FileEntity();
      newFile.filename = file.originalname;
      newFile.filedata = file.buffer;
      newFile.mimetype = file.mimetype;
      return newFile;
    });
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const fileRepositoryEM = em.getRepository(FileEntity);
        return await fileRepositoryEM.save(newFiles);
      },
    );
  }

  public async getFile(file_id: string): Promise<FileEntity | null> {
    return await this.entityManager.transaction(
      this.isolationLevel.set(),
      async (em: EntityManager) => {
        const fileRepositoryEM = em.getRepository(FileEntity);
        return await fileRepositoryEM.findOne({ where: { id: file_id } });
      },
    );
  }
}
