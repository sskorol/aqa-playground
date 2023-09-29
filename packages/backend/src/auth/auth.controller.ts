import { Controller, Body, Post, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { LoginUserDto } from '../users/dto/login.user.dto';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Message } from '../common/message';
import { Route } from '../common/route';
import { Tag } from '../common/tag';
import { LoginStatus } from './dto/login.status.dto';
import { RefreshTokenDto } from './dto/refresh.token.dto';

@Controller(Route.AUTH)
@ApiTags(Tag.AUTH)
export class AuthController {
  @Inject()
  private readonly authService: AuthService;

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: LoginStatus })
  @ApiConflictResponse({ description: Message.USER_EXISTS })
  @ApiInternalServerErrorResponse({ description: Message.SOMETHING_WENT_WRONG })
  public async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoginStatus> {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @ApiOkResponse({ type: LoginStatus })
  @ApiUnauthorizedResponse({ description: Message.INVALID_CREDENTIALS })
  @ApiOperation({ summary: 'Login with an existing account' })
  public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
    return this.authService.login(loginUserDto);
  }

  @Post('refresh')
  public async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginStatus> {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  public async logout(@Body() refreshTokenDto: RefreshTokenDto): Promise<void> {
    await this.authService.invalidateRefreshToken(refreshTokenDto.refreshToken);
  }
}
