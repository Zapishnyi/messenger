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

  //   //Activate--------------------------------------------
  //   @ApiOperation({
  //     summary: "Retrieve a user's activation token by user ID.",
  //   })
  //   @ApiUnauthorizedResponse({
  //     description: 'Unauthorized',
  //     example: {
  //       statusCode: 401,
  //       messages: 'Unauthorized',
  //       timestamp: '2024-12-03T18:55:06.367Z',
  //       path: '/user/2/activate',
  //     },
  //   })
  //   @ApiNotFoundResponse({
  //     description: 'Not Found',
  //     example: {
  //       statusCode: 404,
  //       messages: 'User with ID: 5 -  does not exist',
  //       timestamp: '2024-12-03T20:40:32.905Z',
  //       path: '/user/5/activate',
  //     },
  //   })
  //   @ApiBearerAuth('Access-Token')
  //   @Get('user/:id/activate')
  //   @UseGuards(JwtAccessGuard, AdminRoleGuard)
  //   public async userActivate(
  //     @Param('id', ParseIntPipe) user_id: number,
  //   ): Promise<UserActivateResDto> {
  //     const [{ activate }, user] = await this.adminService.userActivate(user_id);
  //     return {
  //       activateToken: activate,
  //       user: this.userPresenter.toUserNoStatisticResponseDtoFromEntity(user),
  //     };
  //   }

  //   //Get Orders Statistic -------------------------------------
  //   @ApiOperation({
  //     summary: 'Retrieve statistics for all order statuses.',
  //   })
  //   @ApiUnauthorizedResponse({
  //     description: 'Unauthorized',
  //     example: {
  //       statusCode: 401,
  //       messages: 'Unauthorized',
  //       timestamp: '2024-12-03T18:38:15.306Z',
  //       path: 'orders/statistic',
  //     },
  //   })
  //   @ApiBearerAuth('Access-Token')
  //   @UseGuards(JwtAccessGuard, AdminRoleGuard)
  //   @Get('orders/statistic')
  //   public async getOrdersStatusStatistic(): Promise<OrderStatusStatisticResDto> {
  //     return await this.ordersService.getOrdersStatusStatistic();
  //   }

  //   // Add Manager -------------------------------------------------
  //   @ApiOperation({
  //     summary: 'Create a new manager.',
  //   })
  //   @ApiUnauthorizedResponse({
  //     description: 'Unauthorized',
  //     example: {
  //       statusCode: 401,
  //       messages: 'Unauthorized',
  //       timestamp: '2024-12-03T18:55:06.367Z',
  //       path: '/user/create',
  //     },
  //   })
  //   @ApiBadRequestResponse({
  //     description: 'Bad Request',
  //     example: {
  //       statusCode: 400,
  //       messages: ['surname must be a string', 'surname should not be empty'],
  //       timestamp: '2024-12-03T18:58:59.338Z',
  //       path: '/user/create',
  //     },
  //   })
  //   @ApiConflictResponse({
  //     description: 'Conflict',
  //     example: {
  //       statusCode: 409,
  //       messages: 'User is already exists',
  //       timestamp: '2024-12-03T19:00:32.047Z',
  //       path: '/user/create',
  //     },
  //   })
  //   @ApiBearerAuth('Access-Token')
  //   @UseGuards(JwtAccessGuard, AdminRoleGuard)
  //   @Post('user/create')
  //   public async userCreate(
  //     @Body() dto: UserCreateByAdminReqDto,
  //   ): Promise<UserResDto> {
  //     return this.userPresenter.toResponseDtoFromEntity(
  //       await this.adminService.userCreate(dto),
  //     );
  //   }

  //   // Ban---------------------------------------------------
  //   @ApiOperation({
  //     summary: 'Ban or reinstate a user by user ID.',
  //   })
  //   @ApiUnauthorizedResponse({
  //     description: 'Unauthorized',
  //     example: {
  //       statusCode: 401,
  //       messages: 'Unauthorized',
  //       timestamp: '2024-12-03T18:55:06.367Z',
  //       path: '/user/5/ban',
  //     },
  //   })
  //   @ApiNotFoundResponse({
  //     description: 'Not Found',
  //     example: {
  //       statusCode: 404,
  //       messages: 'User with ID: 5 -  does not exist',
  //       timestamp: '2024-12-03T20:40:32.905Z',
  //       path: '/user/5/ban',
  //     },
  //   })
  //   @ApiForbiddenResponse({
  //     description: 'Forbidden',
  //     example: {
  //       statusCode: 403,
  //       messages: "User can't ban himself",
  //       timestamp: '2024-12-03T20:40:32.905Z',
  //       path: '/user/5/ban',
  //     },
  //   })
  //   @ApiBearerAuth('Access-Token')
  //   @Patch('user/:id/ban-reinstate')
  //   @UseGuards(JwtAccessGuard, AdminRoleGuard)
  //   public async userBanReinstate(
  //     @Param('id', ParseIntPipe) user_id: number,
  //     @GetStoredUserDataFromResponse() { user }: IUserData,
  //   ): Promise<UserBanResDto> {
  //     return this.userPresenter.toResponseDtoFromEntity(
  //       await this.adminService.userBanReinstate(user_id, user),
  //     );
  //   }

  //   //Delete User--------------------------------------------------------
  //   @ApiOperation({
  //     summary: 'Delete a user by user ID.',
  //   })
  //   @ApiUnauthorizedResponse({
  //     description: 'Unauthorized',
  //     example: {
  //       statusCode: 401,
  //       messages: 'Unauthorized',
  //       timestamp: '2024-12-03T18:55:06.367Z',
  //       path: '/user/5',
  //     },
  //   })
  //   @ApiForbiddenResponse({
  //     description: 'Forbidden',
  //     example: {
  //       statusCode: 403,
  //       messages: "User can't ban himself",
  //       timestamp: '2024-12-03T20:40:32.905Z',
  //       path: '/user/5',
  //     },
  //   })
  //   @ApiNotFoundResponse({
  //     description: 'Not Found',
  //     example: {
  //       statusCode: 404,
  //       messages: 'User with ID: 5 -  does not exist',
  //       timestamp: '2024-12-03T20:40:32.905Z',
  //       path: '/user/5',
  //     },
  //   })
  //   @ApiBearerAuth('Access-Token')
  //   @Delete('user/:id')
  //   @UseGuards(JwtAccessGuard, AdminRoleGuard)
  //   public async userDelete(
  //     @Param('id', ParseIntPipe) user_id: number,
  //   ): Promise<void> {
  //     await this.adminService.userDelete(user_id);
  //   }

  //   // Delete Group --------------------------------------------
  //   @ApiOperation({
  //     summary: 'Delete a group name by group ID.',
  //   })
  //   @ApiUnauthorizedResponse({
  //     description: 'Unauthorized',
  //     example: {
  //       statusCode: 401,
  //       messages: 'Unauthorized',
  //       timestamp: '2024-12-03T18:38:15.306Z',
  //       path: 'admin/group/:id',
  //     },
  //   })
  //   @ApiConflictResponse({
  //     description: 'Conflict',
  //     example: {
  //       statusCode: 409,
  //       messages: 'Such a group does not exist',
  //       timestamp: '2024-12-03T19:00:32.047Z',
  //       path: '/admin/group/:id',
  //     },
  //   })
  //   @ApiBearerAuth('Access-Token')
  //   @UseGuards(JwtAccessGuard, AdminRoleGuard)
  //   @Delete('group/:id')
  //   public async groupDelete(
  //     @Param('id', ParseIntPipe) group_id: number,
  //   ): Promise<void> {
  //     await this.adminService.groupDelete(group_id);
  //   }
}
