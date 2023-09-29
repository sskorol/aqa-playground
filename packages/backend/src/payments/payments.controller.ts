import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CartDto } from '../products/dto/cart.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { Route } from '../common/route';
import { Tag } from '../common/tag';

@Controller(Route.PAYMENTS)
@ApiBearerAuth()
@ApiTags(Tag.PAYMENTS)
export class PaymentsController {
  @Inject()
  private paymentService: PaymentsService;

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiBody({ type: CartDto })
  @ApiCreatedResponse({ type: String, description: 'Returns client secret' })
  public async createPaymentIntent(@Body() cart: CartDto): Promise<string> {
    return this.paymentService.createPaymentIntent(cart);
  }
}
