import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { setAuthToken, setOnUnauthorized } from '../services/HttpManager';

const storage = {
  getItem: (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') return Promise.resolve(localStorage.getItem(key));
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') { localStorage.setItem(key, value); return Promise.resolve(); }
    return SecureStore.setItemAsync(key, value);
  },
  deleteItem: (key: string): Promise<void> => {
    if (Platform.OS === 'web') { localStorage.removeItem(key); return Promise.resolve(); }
    return SecureStore.deleteItemAsync(key);
  },
};

const TOKEN_KEY = 'colonycare_token';

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOnUnauthorized(() => {
      storage.deleteItem(TOKEN_KEY);
      setAuthToken(null);
      setToken(null);
    });
    storage.getItem(TOKEN_KEY)
      .then((savedToken) => {
        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (newToken: string) => {
    await storage.setItem(TOKEN_KEY, newToken);
    setAuthToken(newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await storage.deleteItem(TOKEN_KEY);
    setAuthToken(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
