import { Module } from '@nestjs/common';

import { AuthTokensRepository } from './services/auth-tokens-repository.service';
import { FileRepository } from './services/file-repository.service';
import { MessageRepository } from './services/message-repository.service';
import { UsersRepository } from './services/users-repository.service';

@Module({
  providers: [
    AuthTokensRepository,
    UsersRepository,
    MessageRepository,
    FileRepository,
  ],
  exports: [
    AuthTokensRepository,
    UsersRepository,
    MessageRepository,
    FileRepository,
  ],
})
export class RepositoryModule {}
