import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import './Product.css';
import { observer } from 'mobx-react-lite';
import cartStore from '../../stores/CartStore';
import { Product } from '../../types/Product';

type ProductProps = {
  product: Product;
};

const ProductComponent: React.FC<ProductProps> = observer(({ product }) => {
  return (
    <Card sx={{ height: '600px', width: '80%', margin: 'auto' }}>
      <CardHeader
        sx={{
          height: '100px',
          textAlign: 'center',
        }}
        title={product.title}
      />
      <CardMedia
        sx={{
          height: '200px',
          width: '80%',
          margin: 'auto',
        }}
        component="img"
        image={product.image}
        alt={product.title}
      />
      <CardContent
        sx={{
          height: '20%',
          margin: 'auto',
        }}
      >
        <Typography
          sx={{
            height: 'auto',
            margin: 'auto',
          }}
          variant="body2"
          color="text.secondary"
        >
          {product.description.substring(0, 200)}
        </Typography>
        <Typography
          sx={{
            height: 'auto',
            textAlign: 'center',
          }}
          variant="subtitle1"
          color="text.primary"
        >
          ${product.price}
        </Typography>
      </CardContent>
      <CardActions>
        <RenderCardActions product={product} />
      </CardActions>
    </Card>
  );
});

const RenderCardActions: React.FC<ProductProps> = observer(({ product }) => {
  const cartItem = cartStore.cart.find((p) => p.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const incrementQuantityByOne = () => {
    cartStore.incrementQuantity(product?.id || 0);
  };

  const decrementQuantityByOne = () => {
    cartStore.decrementQuantity(product?.id || 0);
  };

  const addToCart = () => {
    cartStore.addToCart(product);
  };

  if (quantity === 0) {
    return (
      <Button
        sx={{ width: '80%', margin: 'auto' }}
        variant="contained"
        onClick={addToCart}
      >
        Add to cart
      </Button>
    );
  } else {
    return (
      <div className="quantity-area">
        <Button
          size="small"
          sx={{
            height: '100%',
            minWidth: '30%',
            width: '30%',
            borderRadius: '0px',
            boxShadow: 'none',
          }}
          variant="contained"
          onClick={incrementQuantityByOne}
        >
          +
        </Button>
        <TextField
          size="small"
          sx={{
            height: '100%',
            minWidth: '40%',
            width: '40%',
            textAlign: 'center',
            verticalAlign: 'middle',
          }}
          value={quantity}
        />
        <Button
          size="small"
          sx={{
            height: '100%',
            minWidth: '30%',
            width: '30%',
            borderRadius: '0px',
            boxShadow: 'none',
          }}
          variant="contained"
          onClick={decrementQuantityByOne}
        >
          -
        </Button>
      </div>
    );
  }
});

export default ProductComponent;
