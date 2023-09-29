import { User } from '../entities/user.entity';
import { UserDto } from './user.dto';

export class ReadUserDto {
  static of(user: User): UserDto {
    const { accountId, username, email } = user;

    return {
      accountId,
      username,
      email,
    };
  }
}
