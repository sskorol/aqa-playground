import { Body, Controller, Delete, Get, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { Message } from '../common/message';
import { Route } from '../common/route';
import { Tag } from '../common/tag';
import { CreateProductDto } from './dto/create.product.dto';
import { Product } from './entities/product.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from 'nestjs-pino';

@ApiBearerAuth()
@Controller(Route.PRODUCTS)
@ApiTags(Tag.PRODUCTS)
export class ProductsController {
  @Inject()
  private productService: ProductsService;
  @Inject()
  private logger: Logger;

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ type: ProductDto, description: 'Returns created product' })
  public async addProduct(
    @Body() product: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productService.create(product);
  }

  @Post('/mock')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add new product' })
  @ApiCreatedResponse({ type: [Product], description: 'Returns created products' })
  public async addProducts(): Promise<Product[]> {
    const products = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../data/products.json'), 'utf8'),
    );
    const createdProducts: Product[] = [];
    for (const product of products) {
      createdProducts.push(await this.productService.create(product));
    }
    return createdProducts;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [Product] })
  @ApiUnauthorizedResponse({ description: Message.INVALID_CREDENTIALS })
  @ApiOperation({ summary: 'Fetch all products' })
  public async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiNoContentResponse({ description: Message.NO_CONTENT })
  @ApiUnauthorizedResponse({ description: Message.INVALID_CREDENTIALS })
  @ApiOperation({ summary: 'Delete all products' })
  public async deleteAll(): Promise<void> {
    return this.productService.deleteAll();
  }
}
