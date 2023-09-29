import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
  Typography,
} from '@mui/material';
import productStore from '../../stores/ProductStore';
import { AUTO_HIDE_DURATION } from '../../constants';
import './NewProduct.css';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types/Product';

type FormData = {
  title: string;
  price: string;
  description: string;
  image: string;
  quantity: string;
};

type FormErrors = {
  [key in keyof FormData]: string;
};

type FormValidity = {
  [key in keyof FormData]: boolean;
};

const NewProduct: React.FC = observer(() => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    price: '',
    description: '',
    image: '',
    quantity: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: '',
    price: '',
    description: '',
    image: '',
    quantity: '',
  });
  const [formValidity, setFormValidity] = useState<FormValidity>({
    title: false,
    price: false,
    description: false,
    image: false,
    quantity: false,
  });

  const fields: (keyof FormData)[] = [
    'title',
    'description',
    'image',
    'price',
    'quantity',
  ];

  const validateField = (field: keyof FormData, value: string) => {
    let error = '';

    switch (field) {
      case 'title':
        error = !value ? 'Title is mandatory' : '';
        break;

      case 'price':
        error = !value
          ? 'Price is mandatory'
          : isNaN(parseFloat(value))
          ? 'Price must be a number'
          : '';
        break;

      case 'description':
        error = !value ? 'Description is mandatory' : '';
        break;

      case 'image':
        const isValidUrl = (urlString: string) => {
          let url;
          try {
            url = new URL(urlString);
          } catch (e) {
            return false;
          }
          return url.protocol === 'http:' || url.protocol === 'https:';
        };
        error = !isValidUrl(value) ? 'Image URL is invalid' : '';
        break;

      case 'quantity':
        error = !value
          ? 'Quantity is mandatory'
          : isNaN(parseInt(value))
          ? 'Quantity must be a number'
          : '';
        break;

      default:
        break;
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormValidity((prevValidity) => ({ ...prevValidity, [field]: !error }));
  };

  const capitalizeFirstLetter = (item: string) => {
    return item.charAt(0).toUpperCase() + item.slice(1);
  };

  const handleSubmit = async () => {
    for (const field in formData) {
      validateField(field as keyof FormData, formData[field as keyof FormData]);
    }

    const allFieldsValid = Object.values(formValidity).every((v) => v);

    if (allFieldsValid) {
      const newProduct: Product = {
        id: null,
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image,
        quantity: parseInt(formData.quantity, 10),
      };

      await productStore.addProduct(newProduct);

      if (productStore.isCreated) {
        navigate('/');
      }
    }
  };

  const handleChange = (field: keyof FormData) => (event: any) => {
    const value = event.target.value;
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    validateField(field, value);
  };

  const isFormValid = Object.values(formErrors).every((error) => !error);

  return (
    <div className="new-product-container">
      <Paper className="new-product-paper">
        <Grid container spacing={3}>
          <Grid item>
            <Typography variant="h5">Add New Product</Typography>
          </Grid>
          {fields.map((field) => (
            <Grid item key={field}>
              <TextField
                required
                label={capitalizeFirstLetter(field)}
                id={`outlined-required-${field}`}
                onBlur={() => validateField(field, formData[field])}
                error={!!formErrors[field]}
                helperText={formErrors[field]}
                value={formData[field]}
                onChange={handleChange(field)}
                fullWidth
              />
            </Grid>
          ))}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className="new-product-button"
              disabled={!isFormValid}
              onClick={handleSubmit}
              fullWidth
            >
              Submit
            </Button>
          </Grid>
          <Grid item>
            <Link
              to="/"
              style={{
                marginBottom: '20px',
                display: 'block',
                textAlign: 'center',
              }}
            >
              ← Back to Home
            </Link>
          </Grid>
          <Snackbar
            open={!!productStore.error}
            autoHideDuration={AUTO_HIDE_DURATION}
            onClose={() => productStore.clearError()}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity="error">{productStore.error}</Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={productStore.isCreated}
            onClose={() => productStore.setIsCreated(false)}
            autoHideDuration={AUTO_HIDE_DURATION}
          >
            <Alert severity="success">Product created</Alert>
          </Snackbar>
        </Grid>
      </Paper>
    </div>
  );
});

export default NewProduct;
