import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import authStore from '../../stores/AuthStore';
import './SignUp.css';
import { observer } from 'mobx-react-lite';
import { useNavigate, Link } from 'react-router-dom';
import { AUTO_HIDE_DURATION } from '../../constants';

type SignUpFormData = {
  email: string;
  username: string;
  password: string;
};

export const SignUp: React.FC = observer(() => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<SignUpFormData>({
    email: '',
    username: '',
    password: '',
  });

  const { isLoggedIn } = authStore;

  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }

    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleKeyDown = async (event: any) => {
    if (event.key === 'Enter') {
      await handleSignup();
    }
  };

  const handleSignup = async () => {
    const allFieldsValid = Object.values(formErrors).every((error) => !error);

    if (allFieldsValid) {
      await authStore.signup(
        formData.username,
        formData.email,
        formData.password,
      );
    }
  };

  const fields = [
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      validation: (value: string) => {
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return !regex.test(value.trim())
          ? 'Email should match the pattern'
          : '';
      },
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      validation: (value: string) => {
        return value.trim().length === 0 ? 'Username is mandatory' : '';
      },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validation: (value: string) => {
        return value.trim().length < 8
          ? 'Password should be >= 8 characters'
          : '';
      },
    },
  ];

  const validateField = (field: keyof SignUpFormData, value: string) => {
    const fieldConfig = fields.find((f) => f.name === field);
    if (fieldConfig) {
      const error = fieldConfig.validation(value);
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleChange =
    (field: keyof SignUpFormData) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
      };

  const allFieldsValid = Object.values(formErrors).every((error) => !error);

  return (
    <Grid
      onKeyDown={handleKeyDown}
      container
      className='signup-container-inner'
    >
      <Grid item xs={12}>
        <Paper className='signup-paper'>
          <Grid container direction='column' alignItems='center' spacing={2}>
            <Grid item>
              <Typography variant='h5' className='signup-title'>
                Get Started with Us
              </Typography>
            </Grid>
            {fields.map((field) => (
              <Grid item key={field.name}>
                <TextField
                  inputRef={field.name === 'email' ? emailRef : null}
                  label={field.label}
                  variant='outlined'
                  type={field.type}
                  className='signup-input'
                  onBlur={() =>
                    validateField(
                      field.name as keyof SignUpFormData,
                      formData[field.name as keyof SignUpFormData],
                    )
                  }
                  error={!!formErrors[field.name as keyof SignUpFormData]}
                  helperText={formErrors[field.name as keyof SignUpFormData]}
                  value={formData[field.name as keyof SignUpFormData]}
                  onChange={handleChange(field.name as keyof SignUpFormData)}
                />
              </Grid>
            ))}
            <Grid item>
              <Button
                disabled={!allFieldsValid}
                variant='contained'
                color='primary'
                className='signup-button'
                onClick={handleSignup}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2'>
                Already have an account? <Link to='/login'>Login</Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Snackbar
        open={!!authStore.error}
        autoHideDuration={AUTO_HIDE_DURATION}
        onClose={() => authStore.clearError()}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity='error'>{authStore.error}</Alert>
      </Snackbar>
    </Grid>
  );
});
