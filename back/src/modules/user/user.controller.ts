import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// eslint-disable-next-line max-len
import { GetStoredUserDataFromResponse } from '../../common/custom_decorators/get-stored-user-data-from-response.decorator';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { IUserData } from '../auth/interfaces/IUserData';
import { UserResDto } from '../user/dto/res/user.res.dto';
import { UserPresenterService } from '../user/services/user-presenter.service';
import { UserService } from './services/user.service';

@ApiTags('2.Users')
@Controller('/user')
export class UserController {
  constructor(
    private readonly userPresenter: UserPresenterService,
    private readonly userService: UserService,
  ) {}

  // Get logged user data -----------------------------------------------------
  @ApiOperation({
    summary: 'Retrieve logged-in user data.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/user/me',
    },
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('Access-Token')
  @Get('me')
  public async me(
    @GetStoredUserDataFromResponse() { user }: IUserData,
  ): Promise<UserResDto> {
    return this.userPresenter.toResponseDtoFromEntity(user);
  }

  // Get all users list --------------------------------------------
  @ApiOperation({
    summary: 'Retrieve all users list',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'Unauthorized',
      timestamp: '2024-12-03T18:55:06.367Z',
      path: '/all',
    },
  })
  @ApiBearerAuth('Access-Token')
  @Get('all')
  @UseGuards(JwtAccessGuard)
  public async getAllUsers(): Promise<UserResDto[]> {
    const users = await this.userService.getAllUsers();
    return users.map((e) => this.userPresenter.toResponseDtoFromEntity(e));
  }
}
