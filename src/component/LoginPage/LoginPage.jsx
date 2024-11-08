import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoBackground from '../../assest/login-background.jpg';
import LogoImage from '../../assest/logo-dark.png';
import './LoginPage.css';
import apiService from '../../ApiService/service';

const Login = () => {
  const [credentials, setCredentials] = useState({
    user: '',
    password: '',
  });
  const [errors, setErrors] = useState({ user: '', password: '' });
  const navigate = useNavigate();

  const validateEmail = (user) => {
    const userRegex = /^[A-Za-z]+$/;
    return userRegex.test(user);
  };

  const validatePassword = (password) => {
    return password.length >= 4;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });

    // Clear error when the user starts typing
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleLogin = async () => {
    // Validation checks
    let valid = true;
    const newErrors = { user: '', password: '' };

    if (!validateEmail(credentials.user)) {
      newErrors.user = 'please enter a valid user address.';
      valid = false;
    }

    if (!validatePassword(credentials.password)) {
      newErrors.password = 'please enter a valid password.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    // Proceed with login if validation passes
    try {
      const response = await apiService.post('auth/login', {
        username: credentials.user,
        password: credentials.password,
      });
      sessionStorage.setItem('authToken', response.data.access_token);
      sessionStorage.setItem('userData',JSON.stringify(response.data))
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box className="login-page" display="flex" height="100vh">
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#ffffff"
        p={4}
      >
        <Typography variant="h4" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Enter your username and password to sign in
        </Typography>
        <Box component="form" width="100%" maxWidth="400px">
          <TextField
            fullWidth
            type="user"
            name="user"
            value={credentials.user}
            onChange={handleInputChange}
            variant="outlined"
            label="Username"
            margin="normal"
            required
            error={!!errors.user}
            helperText={errors.user}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            margin="normal"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            required
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogin}
          >
            Submit
          </Button>
          <Button fullWidth variant="outlined" color="primary" sx={{ mt: 2 }}>
            Login via SSO
          </Button>
        </Box>
      </Box>
      <Box
        className="gradient-background"
        flex={1}
        position="relative"
        sx={{
          backgroundImage: `url(${LogoBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          borderRadius: '15px',
          width: '100%',
          right: '1%',
          top: '15px',
        }}
      >
        <Box
          className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
          sx={{
            display: { lg: 'flex', xs: 'none' },
            height: '100%',
            position: 'absolute',
            top: 0,
            right: 0,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src={LogoImage}
            alt="XERAGO Logo"
            style={{ width: '385px', height: 'auto', marginRight: '88px' }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
