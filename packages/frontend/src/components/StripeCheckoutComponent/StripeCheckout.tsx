import React, { useState } from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import './StripeCheckout.css';
import { observer } from 'mobx-react-lite';
import cartStore from '../../stores/CartStore';
import paymentStore from '../../stores/PaymentStore';
import { StripePaymentElementChangeEvent } from '@stripe/stripe-js';

type StripeCheckoutFormProps = {
  handleClose: () => void;
  setSnackSuccessOpen: (shouldOpen: boolean) => void;
  setSnackFailedOpen: (shouldOpen: boolean) => void;
};

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = observer(
  ({ handleClose, setSnackSuccessOpen, setSnackFailedOpen }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [formStatus, setFormStatus] = useState({
      isEmpty: false,
      isComplete: false,
      isProcessing: false,
    });

    const shouldBeDisabled =
      !stripe ||
      !elements ||
      formStatus.isProcessing ||
      !formStatus.isComplete ||
      formStatus.isEmpty;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      setFormStatus((prev) => ({ ...prev, isProcessing: true }));

      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error(submitError);
        return;
      }

      try {
        await paymentStore.pay(stripe, elements);
        handleClose();
        setSnackSuccessOpen(true);
      } catch (err) {
        console.error(err);
        setSnackFailedOpen(true);
      } finally {
        setFormStatus((prev) => ({ ...prev, isProcessing: false }));
        cartStore.clearCart();
      }
    };

    const handleCardChange = (event: StripePaymentElementChangeEvent) => {
      setFormStatus({
        isEmpty: event.empty,
        isComplete: event.complete,
        isProcessing: formStatus.isProcessing,
      });
    };

    return (
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" onChange={handleCardChange} />
        <button disabled={shouldBeDisabled} id="submit">
          <span id="button-text">
            {formStatus.isProcessing ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              'Pay now'
            )}
          </span>
        </button>
      </form>
    );
  },
);

export default StripeCheckoutForm;
