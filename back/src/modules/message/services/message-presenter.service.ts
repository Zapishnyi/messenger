import { Injectable } from '@nestjs/common';

import { MessageEntity } from '../../../database/entities/message.entity';
import { MessageResDto } from '../dto/res/message.res.dto';
import { FilesOutputPresenterService } from './files-output-presenter.service';

@Injectable()
export class MessagePresenterService {
  constructor(
    private readonly filesOutputPresenterService: FilesOutputPresenterService,
  ) {}
  public toResponseDtoFromEntity({
    id,
    receiver_id,
    sender_id,
    content,
    files,
    created,
    updated,
  }: MessageEntity): MessageResDto {
    return {
      id,
      receiver_id,
      sender_id,
      content,
      files: files?.length
        ? files.map((file) =>
            this.filesOutputPresenterService.toResponseDtoFromEntity(file),
          )
        : [],
      created,
      updated,
    };
  }
}
