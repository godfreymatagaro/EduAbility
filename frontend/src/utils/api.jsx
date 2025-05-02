// frontend/src/utils/api.js
import axios from 'axios';

// Determine baseURL based on environment
const getBaseUrl = () => {
  const isProduction = import.meta.env.MODE === 'production';
  const devUrl = import.meta.env.VITE_API_DEV_BACKEND_URL; // http://localhost:3000
  const prodUrl = import.meta.env.VITE_API_PROD_BACKEND_URL; // https://eduability.onrender.com/

  // Use production or development URL, ensuring /api is appended
  const baseUrl = isProduction ? `${prodUrl}/api` : `${devUrl}/api`;
  return baseUrl;
};

const api = axios.create({
  baseURL: getBaseUrl(), // Dynamically set baseURL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;