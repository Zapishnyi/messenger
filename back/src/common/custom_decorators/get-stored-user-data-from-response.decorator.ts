import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IUserData } from '../../modules/auth/interfaces/IUserData';

export const GetStoredUserDataFromResponse = createParamDecorator(
  (data, context: ExecutionContext): IUserData =>
    context.switchToHttp().getRequest().user_data,
);
