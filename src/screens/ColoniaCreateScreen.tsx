import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function ColoniaCreateScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nueva Colonia</Text>
        <View />
      </View>
      <View style={styles.content}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.text}>Formulario próximamente...</Text>
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
  text: { fontSize: 12, color: '#999' },
});
