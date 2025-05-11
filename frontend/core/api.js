import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: "http://192.168.1.48:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Add timeout to prevent hanging requests
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // You can modify successful responses here if needed
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors (no response)
    if (!error.response) {
      return Promise.reject({
        message: 'Network error - please check your connection',
        isNetworkError: true,
      });
    }

    // Handle 401 Unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            'http://192.168.1.48:8000/api/auth/refresh',
            { refreshToken }
          );
          
          const { accessToken } = response.data;
          await AsyncStorage.setItem('accessToken', accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear storage and redirect to login
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        // You might want to navigate to login screen here
        // navigation.navigate('Login');
      }
    }

    // Handle 500 errors specifically
    if (error.response.status === 500) {
      return Promise.reject({
        message: 'Server error - please try again later',
        isServerError: true,
        details: error.response.data,
      });
    }

    // For all other errors, pass them through
    return Promise.reject(error);
  }
);

export default api;