import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CartDto } from '../products/dto/cart.dto';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  @Inject() logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      configService.get<string>('STRIPE_API_SECRET_KEY'),
      {
        apiVersion: '2023-08-16',
      },
    );
  }

  public async createPaymentIntent(cart: CartDto): Promise<string> {
    const totalPrice = cart.products
      .map((product) => product.price * product.quantity)
      .reduce((total, item) => total + item);

    const paymentIntent: Stripe.PaymentIntent =
      await this.stripe.paymentIntents.create({
        amount: Number(totalPrice.toFixed(0)),
        currency: cart.currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

    return paymentIntent.client_secret;
  }
}
