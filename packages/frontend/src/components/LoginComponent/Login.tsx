import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  TextField,
  Paper,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import authStore from '../../stores/AuthStore';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AUTO_HIDE_DURATION } from '../../constants';
import { observer } from 'mobx-react-lite';

type LoginFormData = {
  username: string;
  password: string;
};

type LoginErrors = {
  [key in keyof LoginFormData]: string;
};

type LoginValidity = {
  [key in keyof LoginFormData]: boolean;
};

export const Login: React.FC = observer(() => {
  const navigate = useNavigate();
  const usernameRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<LoginErrors>({
    username: '',
    password: '',
  });
  const [formValidity, setFormValidity] = useState<LoginValidity>({
    username: false,
    password: false,
  });

  const { isLoggedIn } = authStore;

  useEffect(() => {
    authStore.clearError();

    if (usernameRef.current) {
      usernameRef.current.focus();
    }

    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      await handleLogin();
    }
  };

  const handleLogin = async () => {
    Object.keys(formData).forEach((field) => {
      validateField(
        field as keyof LoginFormData,
        formData[field as keyof LoginFormData],
      );
    });

    const allFieldsValid = Object.values(formValidity).every((value) => value);

    if (allFieldsValid) {
      await authStore.login(formData.username, formData.password);
    }
  };

  const validateField = (field: keyof LoginFormData, value: string) => {
    let error = '';

    switch (field) {
      case 'username':
        error = value.trim().length === 0 ? 'Username is mandatory' : '';
        break;

      case 'password':
        error =
          value.trim().length < 8 ? 'Password should be >= 8 characters' : '';
        break;

      default:
        break;
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormValidity((prevValidity) => ({ ...prevValidity, [field]: !error }));
  };

  const handleChange = (field: keyof LoginFormData) => (event: any) => {
    const value = event.target.value;
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    validateField(field, value);
  };

  const isFormValid = Object.values(formErrors).every((error) => !error);

  const fields = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      validation: validateField,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      validation: validateField,
    },
  ];

  return (
    <Grid onKeyDown={handleKeyDown} container>
      <Grid item xs={12}>
        <Paper className="login-paper">
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h5" className="login-title">
                Welcome!
              </Typography>
            </Grid>
            {fields.map((field) => (
              <Grid item key={field.name}>
                <TextField
                  label={field.label}
                  variant="outlined"
                  type={field.type}
                  className="login-input"
                  onBlur={() =>
                    field.validation(
                      field.name as keyof LoginFormData,
                      formData[field.name as keyof LoginFormData],
                    )
                  }
                  error={!!formErrors[field.name as keyof LoginFormData]}
                  helperText={formErrors[field.name as keyof LoginFormData]}
                  value={formData[field.name as keyof LoginFormData]}
                  onChange={handleChange(field.name as keyof LoginFormData)}
                />
              </Grid>
            ))}
            <Grid item>
              <Button
                disabled={!isFormValid}
                variant="contained"
                color="primary"
                className="login-button"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                Don't have an account? <Link to="/signup">Sign up</Link>
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
        <Alert severity="error">{authStore.error}</Alert>
      </Snackbar>
    </Grid>
  );
});
