import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🐱</Text>
        <Text style={styles.title}>ColonyCare</Text>
        <Text style={styles.subtitle}>Bienvenido</Text>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F8F9FA' },
  content:    { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  emoji:      { fontSize: 72, marginBottom: 16 },
  title:      { fontSize: 42, fontWeight: '900', color: '#1A1A2E', fontStyle: 'italic', marginBottom: 8 },
  subtitle:   { fontSize: 16, color: '#666666', marginBottom: 40 },
  button:     { backgroundColor: '#E85D04', borderRadius: 12, padding: 16, paddingHorizontal: 32 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
