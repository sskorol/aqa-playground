import { ProductDto } from './product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CartDto {
  @ApiProperty({ required: true })
  @IsArray()
  products: ProductDto[];

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
