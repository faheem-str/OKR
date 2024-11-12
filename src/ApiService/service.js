import axios from 'axios';
import { history } from '../history';
// Create an instance of axios

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add a token or any other custom logic here
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
  return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors, like unauthorized access or logging
     // Handle errors, like unauthorized access or logging
   if (error.response && error.response.status === 401) {
    console.log('...........',error)
    history.push('/login'); // Redirect to login page on 401 error
    // Redirect to login page when 401 is received
    // navigate()
  }
    return Promise.reject(error);
  }
);


// Methods for API requests
const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default apiService;
