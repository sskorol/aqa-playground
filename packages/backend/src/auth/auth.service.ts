import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { JwtPayload } from './dto/jwt.payload.dto';
import { Message } from '../common/message';
import { LoginStatus } from './dto/login.status.dto';
import { LoginUserDto } from '../users/dto/login.user.dto';
import { UserDto } from '../users/dto/user.dto';
import { Logger } from 'nestjs-pino';
import { RefreshToken } from './entities/refresh.token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  @Inject()
  private readonly usersService: UsersService;
  @Inject()
  private readonly jwtService: JwtService;
  @Inject()
  private readonly logger: Logger;

  @InjectRepository(RefreshToken)
  private readonly refreshTokenRepository: Repository<RefreshToken>;

  public async signUp(userDto: CreateUserDto): Promise<LoginStatus> {
    await this.usersService.create(userDto);
    return this.login({
      username: userDto.username,
      password: userDto.password,
    });
  }

  public async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const user = await this.usersService.findByUsername(loginUserDto);
    const token = await this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  public async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new UnauthorizedException(Message.INVALID_CREDENTIALS);
    }
    return user;
  }

  private async _createToken(user: User): Promise<TokensDto> {
    const payload = { sub: user.accountId, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    await this.saveRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(user: User, token: string): Promise<void> {
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepository.save(refreshToken);
  }

  public async refreshAccessToken(refreshToken: string): Promise<TokensDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token must be provided');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const tokenInDb = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken },
      });

      if (!tokenInDb) {
        throw new UnauthorizedException();
      }

      const user = await this.usersService.findByPayload(payload);
      return this._createToken(user);
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  public async invalidateRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
