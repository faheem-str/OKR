import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2D3F8A', // Your custom color
    },
    secondary: {
      main: '#1E2C6F', // Darker shade for secondary elements
    },
    background: {
        default: 'linear-gradient(344.87deg, #102191 -17%, #202026 57%)',
      },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#1E2C6F', // Hover color for buttons
          },
        },
        contained: {
          backgroundColor: '#2D3F8A',
          color: '#ffffff',
        },
        outlined: {
          color: '#2D3F8A',
          borderColor: '#2D3F8A',
          '&:hover': {
            backgroundColor: '#E3E6F0', // Light background on hover
            borderColor: '#1E2C6F',
          },
        },
      },
    },
  },
});

export default theme;
