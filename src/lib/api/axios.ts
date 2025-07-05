import axios from 'axios';
import {tokenService} from '@/lib/token.service';

// Base URL for main API
// @ts-ignore
const baseURL = 'https://quickquick-backend-341757523815.asia-south1.run.app';

// Base URL for analytics API (different from main API)
// @ts-ignore
const analyticsBaseURL = import.meta.env.VITE_ANALYTICS_API_URL || 'http:localhost:8080';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

// Create a separate instance for analytics services
export const analyticsApi = axios.create({
  baseURL: analyticsBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

// Add request interceptor to include auth token in all analytics requests
analyticsApi.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = tokenService.getToken();

    if (token) {
      // Add token to all requests
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling in analytics requests
analyticsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      tokenService.clearTokens();

      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = tokenService.getToken();

    if (token) {
      // Add token to all requests
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      tokenService.clearTokens();

      // Redirect to login page
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
