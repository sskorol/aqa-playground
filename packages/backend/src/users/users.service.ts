import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, FindOneOptions, Repository } from 'typeorm';
import { ReadUserDto } from './dto/read.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { UserDto } from './dto/user.dto';
import { Message } from '../common/message';
import { Logger } from 'nestjs-pino';
import { compareSync } from 'bcrypt';

@Injectable()
export class UsersService {
  @Inject()
  protected readonly logger: Logger;

  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  public async create(userDto: CreateUserDto): Promise<UserDto> {
    const userInDb = await this.userRepository.findOne({
      where: { username: userDto.username },
    });
    if (userInDb) {
      throw new ConflictException(Message.USER_EXISTS);
    }

    try {
      const user = await this.userRepository.create(userDto);
      await this.userRepository.save(user);
      return ReadUserDto.of(user);
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    }
  }

  public async findAll(): Promise<UserDto[]> {
    return (await this.userRepository.find()).map((user) =>
      ReadUserDto.of(user),
    );
  }

  public async findOne(options?: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(options);
  }

  public async findByUsername({
    username,
    password,
  }: LoginUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException(Message.INVALID_CREDENTIALS);
    }

    const areEqual = compareSync(password, user.password);

    if (!areEqual) {
      throw new UnauthorizedException(Message.INVALID_CREDENTIALS);
    }

    return user;
  }

  public async findByPayload({ username }: Partial<User>): Promise<User> {
    return this.findOne({ where: { username } });
  }

  public async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    await this.userRepository.update({ accountId: id }, updateUserDto);
    const user = await this.findOne({ where: { accountId: id } });

    if (!user) {
      throw new NotFoundException(`Unable to find user #${id}`);
    }

    return ReadUserDto.of(user);
  }

  public async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ accountId: id });
  }
}
