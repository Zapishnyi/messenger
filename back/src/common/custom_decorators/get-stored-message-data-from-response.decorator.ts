import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { MessageEntity } from '../../database/entities/message.entity';

export const GetStoredMessageDataFromResponse = createParamDecorator(
  (data, context: ExecutionContext): MessageEntity =>
    context.switchToHttp().getRequest().message_data,
);
