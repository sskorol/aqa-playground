import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;
}
