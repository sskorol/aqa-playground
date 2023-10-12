import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

function getEnvVar(key: string): string {
  if (window._env_ && window._env_[key]) {
    return window._env_[key];
  } else if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  throw new Error(`Environment variable ${key} is not set`);
}

export const AUTO_HIDE_DURATION = 5000;
export const BE_URL = getEnvVar('VITE_REACT_APP_BE_URL');
export const STRIPE_KEY = getEnvVar('VITE_REACT_APP_STRIPE_PUB_KEY');
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
