import { Product } from '../entities/product.entity';
import { ProductDto } from './product.dto';

export class ReadProductDto {
  static of(product: Product): ProductDto {
    const { id, title, quantity, price } = product;

    return {
      title,
      quantity,
      price,
    };
  }
}
