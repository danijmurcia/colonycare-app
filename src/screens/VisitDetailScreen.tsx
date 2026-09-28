import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ColoniesStackParamList } from '../navigation/types';
import { Visit } from '../services/coloniesService';

export default function VisitDetailScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const visit: Visit = route.params?.visit;

  if (!visit) return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.error}>No se pudo cargar la visita</Text>
    </SafeAreaView>
  );

  const fecha = new Date(visit.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hora = new Date(visit.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Volver</Text>
      </TouchableOpacity>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 Detalles de la visita</Text>
          <View style={styles.dateBox}>
            <Text style={styles.fecha}>{fecha}</Text>
            <Text style={styles.hora}>{hora}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>🐱 Gatos vistos</Text>
          <Text style={styles.value}>{visit.cats_seen || 0}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>🍽️ Comida seca (gramos)</Text>
          <Text style={styles.value}>{visit.food_grams || 0} g</Text>
        </View>
        {visit.wet_food_cans !== undefined && visit.wet_food_cans !== null && (
          <View style={styles.card}>
            <Text style={styles.label}>🥫 Latas de comida húmeda</Text>
            <Text style={styles.value}>{visit.wet_food_cans}</Text>
          </View>
        )}
        {visit.notes && (
          <View style={styles.card}>
            <Text style={styles.label}>📝 Notas</Text>
            <Text style={styles.notesText}>{visit.notes}</Text>
          </View>
        )}
        <View style={styles.card}>
          <Text style={styles.label}>👤 Registrado por</Text>
          <Text style={styles.value}>
            {visit.user ? (visit.user.first_name || visit.user.last_name) ? `${visit.user.first_name ?? ''} ${visit.user.last_name ?? ''}`.trim() : visit.user.email : 'Desconocido'}
          </Text>
          {visit.user?.first_name || visit.user?.last_name ? <Text style={styles.subValue}>{visit.user.email}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  backBtn: { fontSize: 16, color: '#E85D04', fontWeight: '700', marginHorizontal: 16, marginVertical: 12 },
  content: { flex: 1, paddingHorizontal: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 12 },
  dateBox: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, borderLeftWidth: 4, borderLeftColor: '#E85D04' },
  fecha: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', textTransform: 'capitalize' },
  hora: { fontSize: 12, color: '#999', marginTop: 4 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  label: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 8 },
  value: { fontSize: 20, fontWeight: '800', color: '#E85D04' },
  notesText: { fontSize: 14, color: '#666', lineHeight: 20 },
  error: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 20 },
  subValue: { fontSize: 12, color: '#999', marginTop: 4 },
});
