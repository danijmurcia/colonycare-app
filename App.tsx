import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (email: string, password: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaProvider>
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <></>
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
