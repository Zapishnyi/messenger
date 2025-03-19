import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// eslint-disable-next-line max-len
import { GetStoredUserDataFromResponse } from '../../common/custom_decorators/get-stored-user-data-from-response.decorator';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { UserResDto } from '../user/dto/res/user.res.dto';
import { UserPresenterService } from '../user/services/user-presenter.service';
import { UserAuthReqDto } from './dto/req/user-auth.req.dto';
import { UserSingUpReqDto } from './dto/req/user-sing-up.req.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { IUserData } from './interfaces/IUserData';
import { AuthService } from './services/auth.service';

@ApiTags('1.Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userPresenter: UserPresenterService,
  ) {}

  // Sign in ---------------------------------------------------
  @ApiOperation({
    summary: 'User log-in using email and password',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'Unauthorized',
      timestamp: '2024-12-03T18:41:52.824Z',
      path: '/auth/sign-in',
    },
  })
  @Post('sign-in')
  public async signIn(
    @Body() dto: UserAuthReqDto,
    @Req() request: Request,
  ): Promise<AuthResDto> {
    const [user, tokens] = await this.authService.signIn(dto, request);
    return { tokens, user: this.userPresenter.toResponseDtoFromEntity(user) };
  }

  // Sing up ---------------------------------------------
  @ApiOperation({
    summary: 'User sing up.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'Unauthorized',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/auth/sing-up',
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: {
      statusCode: 400,
      messages: ['Password must contain  ...'],
      timestamp: '2025-01-29T14:25:09.535Z',
      path: '/auth/sign-up',
    },
  })
  @Post('sign-up')
  public async singUp(@Body() dto: UserSingUpReqDto): Promise<UserResDto> {
    const user = await this.authService.singUp(dto);
    return this.userPresenter.toResponseDtoFromEntity(user);
  }

  // Refresh tokens --------------------------------------------
  @ApiOperation({
    summary: 'Refresh of tokens pair.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/auth/refresh',
    },
  })
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth('Refresh-Token')
  @Post('refresh')
  public async refresh(
    @GetStoredUserDataFromResponse() userData: IUserData,
  ): Promise<AuthResDto> {
    const tokens = await this.authService.refresh(userData);
    return {
      tokens,
      user: this.userPresenter.toResponseDtoFromEntity(userData.user),
    };
  }

  // Log out -----------------------------------------------------
  @ApiOperation({
    summary: 'User log out.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      statusCode: 401,
      messages: 'jwt expired',
      timestamp: '2024-12-03T18:52:08.622Z',
      path: '/auth/sign-out',
    },
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('Access-Token')
  @Post('sign-out')
  async signOut(
    @GetStoredUserDataFromResponse() userData: IUserData,
  ): Promise<void> {
    await this.authService.signOut(userData);
  }
}
