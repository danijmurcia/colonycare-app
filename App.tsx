import React, { useState } from 'react';
import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainNavigator from './src/navigation/MainNavigator';

type Screen = 'login' | 'register';

function AppNavigator() {
  const { token, isLoading } = useAuth();
  const [screen, setScreen] = useState<Screen>('login');

  if (isLoading) return null;

  if (token) {
    return <MainNavigator />;
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
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
