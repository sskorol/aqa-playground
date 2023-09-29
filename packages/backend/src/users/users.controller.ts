import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Message } from '../common/message';
import { UserDto } from './dto/user.dto';
import { PartialRequestDto } from '../auth/dto/partial.request.dto';
import { ReadUserDto } from './dto/read.user.dto';
import { Tag } from '../common/tag';
import { Route } from '../common/route';

@Controller(Route.USERS)
@ApiBearerAuth()
@ApiTags(Tag.USERS)
export class UsersController {
  @Inject()
  private readonly usersService: UsersService;

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [UserDto] })
  @ApiUnauthorizedResponse({ description: Message.INVALID_CREDENTIALS })
  @ApiOperation({ summary: 'Fetch all users' })
  public async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ description: Message.INVALID_CREDENTIALS })
  @ApiNotFoundResponse({ description: Message.NOT_FOUND })
  @ApiBadRequestResponse({ description: Message.BAD_REQUEST })
  @ApiOperation({ summary: 'Update an existing user by account id' })
  public async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: Message.UNDELETABLE_USER })
  @ApiOperation({ summary: 'Register an existing user' })
  public async remove(@Param('id') id: number, @Req() req: any): Promise<void> {
    const user = await this.usersService.findOne({ where: { accountId: id } });
    if (user.accountId === req.user.accountId) {
      throw new BadRequestException(Message.UNDELETABLE_USER);
    }
    await this.usersService.remove(id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({ description: Message.INVALID_CREDENTIALS })
  @ApiOperation({ summary: 'Get info about logged in user' })
  public whoAmI(@Req() request: PartialRequestDto): UserDto {
    return ReadUserDto.of(request.user);
  }
}
