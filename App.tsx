import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

type Screen = 'login' | 'register';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>('login');

  return (
    <ToastProvider>
      <SafeAreaProvider>
        {!isLoggedIn ? (
          screen === 'login' ? (
            <LoginScreen
              onLogin={() => setIsLoggedIn(true)}
              onGoToRegister={() => setScreen('register')}
            />
          ) : (
            <RegisterScreen
              onRegisterSuccess={() => setScreen('login')}
              onGoToLogin={() => setScreen('login')}
            />
          )
        ) : (
          <></>
        )}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ToastProvider>
  );
}
