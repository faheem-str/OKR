import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import LogoBackground from '../../assest/login-background.jpg'
import LogoImage from '../../assest/logo-dark.png'
import './LoginPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../ApiService/service';

import axios from 'axios';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      const response = await apiService.post('auth/login', {username: email, password: password});
      // Save token or any relevant data
      sessionStorage.setItem('authToken', response.data.access_token);
      console.log(response)
      // Redirect to home page
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // JSX for your login form goes here

  return (
    <Box
      className="login-page"
      display="flex"
      height="100vh"
    >
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
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
             onChange={(e) => setPassword(e.target.value)}
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
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login via SSO
          </Button>
        </Box>
      </Box>

      <Box 
        className="gradient-background"
        flex={1}
        position="relative"
        sx={{
        // background: `linear-gradient(344.87deg, #102191 -17%, #202026 57%), url(${LogoBackground})`,
            //   background: 'linear-gradient(344.87deg, #102191 -17%, #202026 57%)',
            backgroundImage: `url(${LogoBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          borderRadius: '15px',
          width: '100%',
          right: '1%',
          top: '15px'
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
            style={{ width: '385px', height: 'auto', marginRight: '88px'}} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
