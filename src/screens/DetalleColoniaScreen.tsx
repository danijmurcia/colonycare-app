import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function DetalleColoniaScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation();
  const { colonyId } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalle Colonia</Text>
        <View />
      </View>
      <View style={styles.content}>
        <Text style={styles.emoji}>🐱</Text>
        <Text style={styles.subtitle}>ID: {colonyId}</Text>
        <Text style={styles.text}>Próximamente...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { fontSize: 16, color: '#E85D04', fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', color: '#1A1A2E' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 64, marginBottom: 16 },
  subtitle: { fontSize: 14, color: '#999' },
  text: { fontSize: 12, color: '#999', marginTop: 8 },
});
