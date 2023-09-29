import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Badge,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
} from '@mui/material';
import { useState } from 'react';
import CheckoutList from '../CheckoutComponent/CheckoutList';
import StripeCheckoutForm from '../StripeCheckoutComponent/StripeCheckout';
import './Cart.css';
import { Elements } from '@stripe/react-stripe-js';
import { STRIPE, STRIPE_HELP_URL, STRIPE_OPTIONS } from '../../constants';
import { observer } from 'mobx-react-lite';
import cartStore from '../../stores/CartStore';
import authStore from '../../stores/AuthStore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Grid } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useNavigate } from 'react-router-dom';

type CartProps = {
  setSnackSuccessOpen: (shouldOpen: boolean) => void;
  setSnackFailedOpen: (shouldOpen: boolean) => void;
};

const Cart: React.FC<CartProps> = observer(
  ({ setSnackSuccessOpen, setSnackFailedOpen }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleClose = () => {
      setOpen(false);
      cartStore.clearCart();
    };

    const goToCheckout = () => {
      setOpen(true);
    };

    const handleLogout = () => {
      cartStore.clearCart();
      authStore.logout();
    };

    return (
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Badge badgeContent={cartStore.totalItems()} color="secondary">
            {cartStore.totalItems() > 0 ? (
              <ShoppingCartIcon
                onClick={goToCheckout}
                fontSize="large"
                color="primary"
                sx={{
                  cursor: 'pointer',
                  verticalAlign: 'middle',
                  display: 'table-cell',
                }}
              />
            ) : (
              <RemoveShoppingCartIcon
                fontSize="large"
                color="disabled"
                sx={{
                  verticalAlign: 'middle',
                  display: 'table-cell',
                }}
              />
            )}
          </Badge>
          <Checkout
            open={open}
            handleClose={handleClose}
            setSnackSuccessOpen={setSnackSuccessOpen}
            setSnackFailedOpen={setSnackFailedOpen}
          />
        </Grid>
        <Grid item>
          <Badge>
            <AddBoxIcon
              color="primary"
              sx={{
                cursor: 'pointer',
                verticalAlign: 'middle',
                display: 'table-cell',
              }}
              onClick={() => navigate('/new-product')}
            />
          </Badge>
        </Grid>
        <Grid item>
          <Badge>
            <ExitToAppIcon
              onClick={handleLogout}
              fontSize="large"
              color="primary"
              sx={{
                cursor: 'pointer',
                verticalAlign: 'middle',
                display: 'table-cell',
              }}
            />
          </Badge>
        </Grid>
      </Grid>
    );
  },
);

type CheckoutProps = {
  open: boolean;
  handleClose: () => void;
  setSnackSuccessOpen: (shouldOpen: boolean) => void;
  setSnackFailedOpen: (shouldOpen: boolean) => void;
};

const Checkout: React.FC<CheckoutProps> = observer(
  ({ open, handleClose, setSnackSuccessOpen, setSnackFailedOpen }) => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: 'center',
            color: 'black',
          }}
        >
          {'Checkout'}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: '100%',
            }}
          >
            <CheckoutList />
          </Box>
        </DialogContent>
        <Box
          sx={{
            color: 'white',
            padding: '16px 16px 10px 10px',
          }}
        >
          <Elements stripe={STRIPE} options={STRIPE_OPTIONS}>
            <StripeCheckoutForm
              handleClose={handleClose}
              setSnackSuccessOpen={setSnackSuccessOpen}
              setSnackFailedOpen={setSnackFailedOpen}
            />
          </Elements>
          <Box
            sx={{
              marginTop: 2,
              marginBottom: 2,
              textAlign: 'center',
            }}
          >
            <Link
              href={STRIPE_HELP_URL}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
            >
              Need help? See Stripe testing cards.
            </Link>
          </Box>
        </Box>
      </Dialog>
    );
  },
);

export default Cart;
