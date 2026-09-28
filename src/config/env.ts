import Constants from 'expo-constants';

// Lee desde .env → REACT_APP_API_URL, fallback a localhost
export const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.REACT_APP_API_URL ??
  'http://localhost:8000';
