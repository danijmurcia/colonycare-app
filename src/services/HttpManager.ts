import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/env';

const httpManager: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpManager.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - clearToken');
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
