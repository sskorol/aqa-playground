import { makeAutoObservable } from 'mobx';
import cartStore, { CartStore } from './CartStore';
import api from '../api';
import { Stripe, StripeElements } from '@stripe/stripe-js';

class PaymentStore {
  client_secret = '';
  isLoading = true;
  cartStore: CartStore | null = null;
  currency = 'usd';

  constructor(cartStore: CartStore) {
    this.cartStore = cartStore;
    makeAutoObservable(this);
  }

  createPaymentIntent = async () => {
    this.setIsLoading(true);
    const products = this.cartStore?.cart.map((item) => ({
      item: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));
    try {
      const response = await api.post('/payments', {
        products: products,
        currency: this.currency,
      });
      this.setSecret(response.data);
    } catch (error) {
      this.setSecret('');
      throw new Error('Unable to create payment');
    } finally {
      this.setIsLoading(false);
    }
  };

  confirmPayment = async (stripe: Stripe, elements: StripeElements) => {
    if (!this.client_secret) {
      throw new Error('Unable to confirm payment');
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: this.client_secret,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href,
      },
    });

    this.setSecret('');

    if (error) {
      throw new Error(error.code);
    }
  };

  pay = async (stripe: Stripe, elements: StripeElements) => {
    await paymentStore.createPaymentIntent();
    await paymentStore.confirmPayment(stripe, elements);
  };

  setSecret(value: string) {
    this.client_secret = value;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
}

const paymentStore = new PaymentStore(cartStore);

export default paymentStore;
