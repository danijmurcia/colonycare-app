import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/env';

const httpManager: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let _onUnauthorized: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  _onUnauthorized = callback;
};

httpManager.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Token expirado - redirigiendo al login');
      if (_onUnauthorized) _onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    httpManager.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete httpManager.defaults.headers.common['Authorization'];
  }
};

export default httpManager;
