import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

export const AUTO_HIDE_DURATION = 5000;
export const BE_URL = import.meta.env.VITE_REACT_APP_BE_URL;
export const STRIPE_KEY = import.meta.env.VITE_REACT_APP_STRIPE_PUB_KEY;
export const STRIPE_OPTIONS: StripeElementsOptions = {
  mode: 'payment',
  amount: 100,
  currency: 'usd',
  appearance: {
    theme: 'stripe',
  },
};
export const STRIPE = loadStripe(STRIPE_KEY);
export const STRIPE_HELP_URL = 'https://stripe.com/docs/testing';
