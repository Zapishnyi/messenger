import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { UserSearchQueryDto } from './dto/req/user-search.query.dto';
import { UserMeResDto } from './dto/res/user-me.res.dto';
import { UserService } from './services/user.service';

@ApiTags('2.Users')
@Controller('/user')
export class UserController {
  constructor(
    private readonly userPresenter: UserPresenterService,
    private readonly userService: UserService,
  ) {}

  // Get all users list --------------------------------------------
  @ApiOperation({
    summary: 'Search for users by query.',
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
  @Get('search')
  @UseGuards(JwtAccessGuard)
  public async getUsersByQuery(
    @Query() query: UserSearchQueryDto,
  ): Promise<UserResDto[]> {
    const users = await this.userService.getUsersByQuery(query);
    return users.map((e) => this.userPresenter.toResponseDtoFromEntity(e));
  }

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
  ): Promise<UserMeResDto> {
    return this.userPresenter.toMeResponseDtoFromEntity(user);
  }

  // Get User by Id ----------------------------------------------------
  @ApiOperation({
    summary: 'Get user by ID.',
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
  @Get(':id')
  @UseGuards(JwtAccessGuard)
  public async getUserById(
    @Param('id', ParseUUIDPipe) user_id: string,
  ): Promise<UserResDto> {
    return this.userPresenter.toResponseDtoFromEntity(
      await this.userService.getUserById(user_id),
    );
  }

  // Add contact ----------------------------------------------------
  @ApiOperation({
    summary: 'Add contact to logged-in user contacts list',
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
  @Post('contact/:id')
  @UseGuards(JwtAccessGuard)
  public async addContact(
    @GetStoredUserDataFromResponse() { user }: IUserData,
    @Param('id', ParseUUIDPipe) contact_id: string,
  ): Promise<UserMeResDto> {
    const userUpdated = await this.userService.addContact(user, contact_id);
    return this.userPresenter.toMeResponseDtoFromEntity(userUpdated);
  }

  // Delete contact ----------------------------------------------------
  @ApiOperation({
    summary: 'Delete contact from logged-in user contacts list',
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
  @Delete('contact/:id')
  @UseGuards(JwtAccessGuard)
  public async deleteContact(
    @GetStoredUserDataFromResponse() { user }: IUserData,
    @Param('id', ParseUUIDPipe) contact_id: string,
  ): Promise<UserMeResDto> {
    const userUpdated = await this.userService.deleteContact(user, contact_id);
    return this.userPresenter.toMeResponseDtoFromEntity(userUpdated);
  }
}
