import React, { useEffect } from 'react';
import './Main.css';
import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import ProductComponent from '../ProductComponent/ProductComponent';
import Cart from '../CartComponent/Cart';
import { Alert, Snackbar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import authStore from '../../stores/AuthStore';
import productStore from '../../stores/ProductStore';
import { Box } from '@mui/material';
import { AUTO_HIDE_DURATION } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types/Product';

type RenderProductsProps = {
  products: Product[];
};

type MainHeaderProps = {
  setSnackSuccessOpen: (shouldOpen: boolean) => void;
  setSnackFailedOpen: (shouldOpen: boolean) => void;
};

const MainHeader: React.FC<MainHeaderProps> = ({
                                                 setSnackSuccessOpen,
                                                 setSnackFailedOpen,
                                               }) => (
  <Grid container alignItems='center'>
    <Grid item lg={1}></Grid>
    <Grid item lg={10}>
      <Box display='flex' justifyContent='center'>
        <Typography variant='h1'>RANDOM STORE</Typography>
      </Box>
    </Grid>
    <Grid item lg={1} sx={{ display: 'table' }}>
      <Box display='flex' justifyContent='flex-end'>
        <Cart
          setSnackSuccessOpen={setSnackSuccessOpen}
          setSnackFailedOpen={setSnackFailedOpen}
        />
      </Box>
    </Grid>
  </Grid>
);

const Main: React.FC = observer(() => {
  const navigate = useNavigate();

  if (!authStore.isLoggedIn) {
    navigate('/login');
  }

  useEffect(() => {
    productStore.getProducts();
  }, []);

  const { products, isLoading } = productStore;
  const [snackSuccessOpen, setSnackSuccessOpen] = useState(false);
  const [snackFailedOpen, setSnackFailedOpen] = useState(false);

  const handleClose = () => {
    setSnackSuccessOpen(false);
    setSnackFailedOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='main-body'>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackSuccessOpen}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={handleClose}
      >
        <Alert className='alert' severity='success'>Payment Successful</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackFailedOpen}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={handleClose}
      >
        <Alert className='alert' severity='error'>Payment Failed</Alert>
      </Snackbar>
      <MainHeader
        setSnackSuccessOpen={setSnackSuccessOpen}
        setSnackFailedOpen={setSnackFailedOpen}
      />
      <Grid container spacing={2} justifyContent='center' alignItems='center'>
        <RenderProducts products={products} />
      </Grid>
    </div>
  );
});

const RenderProducts: React.FC<RenderProductsProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <Typography variant='body2' sx={{ justifyContent: 'center' }}>
        No products available yet.{' '}
        <Link
          to='/new-product'
          style={{ color: 'white', textDecoration: 'underline' }}
        >
          Create a new product
        </Link>
      </Typography>
    );
  }

  const getGridColumnValue = (productCount: number) => {
    if (productCount === 1) return 12; // full width
    if (productCount === 2) return 6; // half width
    if (productCount === 3) return 4; // one third width
    return 3; // default quarter width
  };

  const gridColumnValue = getGridColumnValue(products.length);

  return products.map((product) => {
    return (
      <Grid
        key={product.id}
        item
        xs={gridColumnValue}
        style={{ display: 'inline-block' }}
      >
        <ProductComponent product={product} />
      </Grid>
    );
  });
};

export default Main;
