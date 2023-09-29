import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @ApiProperty({ required: true })
  @IsNumber()
  price: number;

  @ApiProperty({ required: true })
  @IsNumber()
  quantity: number;
}
