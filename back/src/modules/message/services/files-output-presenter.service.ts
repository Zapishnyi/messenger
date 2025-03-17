import { Injectable } from '@nestjs/common';

import { FileEntity } from '../../../database/entities/file.entity';
import IFile from '../interfaces/IFile';

@Injectable()
export class FilesOutputPresenterService {
  public toResponseDtoFromEntity({ id, filename }: FileEntity): IFile {
    return {
      file_id: id,
      file_name: filename,
    };
  }
}
