import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';

type Screen = 'login' | 'register';

function AppNavigator() {
  const { token, isLoading } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');

  if (isLoading) return null;

  if (token) {
    return <HomeScreen />;
  }

  return screen === 'login' ? (
    <LoginScreen
      onGoToRegister={() => setScreen('register')}
    />
  ) : (
    <RegisterScreen
      onRegisterSuccess={() => setScreen('login')}
      onGoToLogin={() => setScreen('login')}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SafeAreaProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
