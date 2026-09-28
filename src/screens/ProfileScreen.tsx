import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mi Perfil</Text>
      <View style={styles.content}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.first_name || 'Usuario'} {user?.last_name || ''}</Text>
        {user?.is_superuser && <View style={styles.superuserBadge}><Text style={styles.badgeText}>SUPERADMIN</Text></View>}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Correo electrónico</Text>
          <Text style={styles.value}>{user?.email || 'N/A'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Estado</Text>
          <Text style={styles.value}>{user?.is_active ? 'Activo' : 'Inactivo'}</Text>
        </View>
        {user?.phone && (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { fontSize: 22, fontWeight: '800', color: '#1A1A2E', paddingHorizontal: 16, paddingVertical: 12 },
  content: { flex: 1, paddingHorizontal: 16, paddingVertical: 20 },
  avatarBox: { alignItems: 'center', marginBottom: 16 },
  avatar: { fontSize: 72, backgroundColor: '#E85D04', width: 120, height: 120, borderRadius: 60, textAlign: 'center', textAlignVertical: 'center' },
  name: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', textAlign: 'center', marginBottom: 8 },
  superuserBadge: { alignItems: 'center', marginBottom: 20 },
  badgeText: { backgroundColor: '#D32F2F', color: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, fontSize: 11, fontWeight: '700' },
  infoBox: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#E85D04' },
  label: { fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  logoutBtn: { backgroundColor: '#D32F2F', borderRadius: 12, paddingVertical: 14, marginHorizontal: 16, marginBottom: 20, alignItems: 'center' },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
