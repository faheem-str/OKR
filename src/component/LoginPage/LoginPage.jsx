import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import LogoBackground from '../../assest/login-background.jpg';
import LogoImage from '../../assest/logo-dark.png';
import './LoginPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../ApiService/service';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await apiService.post('auth/login', {
        username: credentials.email,
        password: credentials.password,
      });
      // Save token or any relevant data
      sessionStorage.setItem('authToken', response.data.access_token);
      sessionStorage.setItem('userData',JSON.stringify(response.data))
      console.log(response);
      // Redirect to the home page
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
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            variant="outlined"
            label="Username"
            margin="normal"
            required
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
