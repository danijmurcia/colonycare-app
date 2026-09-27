import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import * as Font from 'expo-font';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'Playfair Display': require('../../assets/fonts/PlayfairDisplay-Bold.ttf'),
        });
        setFontLoaded(true);
      } catch (e) {
        setFontLoaded(true);
      }
    }
    loadFonts();
  }, []);

  const handleLogin = () => {
    let hasError = false;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('El email es requerido');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Email no válido');
      hasError = true;
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Mínimo 6 caracteres');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    setTimeout(() => {
      onLogin(email, password);
      setLoading(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🐱</Text>
          <Text style={[styles.title, fontLoaded && { fontFamily: 'Playfair Display' }]}>ColonyCare</Text>
          <Text style={styles.subtitle}>Gestión de Colonias Felinas</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Iniciando...' : 'Iniciar Sesión'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity>
            <Text style={styles.link}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { flex: 1, justifyContent: 'space-between', padding: 24 },
  header: { alignItems: 'center', marginTop: 40 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 42, fontWeight: '800', color: '#1A1A2E', marginBottom: 8, letterSpacing: 1.2 },
  subtitle: { fontSize: 14, color: '#666' },
  form: { marginTop: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#1A1A2E', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E0E0E0', fontSize: 16 },
  error: { fontSize: 12, color: '#D32F2F', marginBottom: 12 },
  button: { backgroundColor: '#E85D04', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#666', fontSize: 14 },
  link: { color: '#E85D04', fontWeight: '600' },
});
