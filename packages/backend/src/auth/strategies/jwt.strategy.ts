import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Message } from '../../common/message';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../dto/jwt.payload.dto';
import { UserDto } from '../../users/dto/user.dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject()
  private logger: Logger;
  @Inject()
  private readonly authService: AuthService;

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<UserDto> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException(Message.INVALID_CREDENTIALS);
    }
    return user;
  }
}
