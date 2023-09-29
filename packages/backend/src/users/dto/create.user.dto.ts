import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MaxLength(10)
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
