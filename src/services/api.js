
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-s38r.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agrinexus_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle session expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('agrinexus_token');
      localStorage.removeItem('agrinexus_user');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

