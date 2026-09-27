import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (email: string, password: string) => {
    // TODO: Integrar con API
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  return (
    <>
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        // HomeScreen aquí próximamente
        <></>
      )}
      <StatusBar style="auto" />
    </>
  );
}
