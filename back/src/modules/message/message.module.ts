import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { IsolationLevelModule } from '../transaction-isolation-level/isolation-level.module';
import { MessageController } from './message.controller';
import { FileService } from './services/file.service';
import { FilesOutputPresenterService } from './services/files-output-presenter.service';
import { MessageService } from './services/message.service';
import { MessagePresenterService } from './services/message-presenter.service';

@Module({
  imports: [RepositoryModule, AuthModule, IsolationLevelModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessagePresenterService,
    FileService,
    FilesOutputPresenterService,
  ],
  exports: [MessageService],
})
export class MessageModule {}
