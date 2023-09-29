import { ApiProperty } from '@nestjs/swagger';

export class LoginStatus {
  @ApiProperty()
  username: string;

  @ApiProperty()
  accessToken: object;

  @ApiProperty()
  expiresIn: object;
}
