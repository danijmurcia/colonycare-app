import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ColoniesStackParamList } from '../navigation/types';
import { coloniesService } from '../services/coloniesService';

export default function ColonyDetailScreen() {
  const route = useRoute() as any;
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const { colonyId } = route.params || {};
  const [colony, setColony] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadColonyData();
    }, [colonyId])
  );

  const loadColonyData = async () => {
    try {
      const [colonyData, visitsData] = await Promise.all([
        coloniesService.getById(colonyId),
        coloniesService.getVisits(colonyId),
      ]);
      setColony(colonyData);
      setVisits(visitsData || []);
    } catch (error) {
      console.error('Error loading colony:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.centerLoader}><ActivityIndicator size="large" color="#E85D04" /></View>;

  if (!colony) return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backBtn}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.errorText}>No se pudo cargar la colonia</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{colony.name}</Text>
        <View />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>📍 Localizacion</Text>
          <Text style={styles.value}>{colony.location}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>🐱 Gatos estimados</Text>
          <Text style={styles.value}>{colony.estimated_cats || 0}</Text>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('colony-edit', { colonyId })}>
            <Text style={styles.editBtnText}>✎ Editar colonia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.visitBtn} onPress={() => navigation.navigate('visit-new', { colonyId })}>
            <Text style={styles.visitBtnText}>+ Registrar visita</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Historial de visitas ({visits.length})</Text>
          {visits.length === 0 ? (
            <Text style={styles.noVisits}>Sin visitas registradas</Text>
          ) : (
            <FlatList data={visits} renderItem={({ item }) => <TouchableOpacity style={styles.visitItem} onPress={() => navigation.navigate('visit-detail', { visit: item })}><Text style={styles.visitDate}>{new Date(item.date).toLocaleDateString('es-ES')}</Text><Text style={styles.visitDetail}>{item.cats_seen || 0} gatos · {item.notes || 'Sin notas'}</Text></TouchableOpacity>} keyExtractor={(item, i) => String(i)} scrollEnabled={false} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  headerBtn: { padding: 4 },
  backBtn: { fontSize: 16, color: '#E85D04', fontWeight: '700' },
  title: { fontSize: 18, fontWeight: '800', color: '#1A1A2E', flex: 1, textAlign: 'center' },
  content: { flex: 1, paddingHorizontal: 16, paddingVertical: 12 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12 },
  label: { fontSize: 13, color: '#999', fontWeight: '600', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A2E', marginBottom: 12 },
  noVisits: { fontSize: 13, color: '#999', fontStyle: 'italic' },
  visitItem: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, marginBottom: 8 },
  visitDate: { fontSize: 13, fontWeight: '700', color: '#E85D04' },
  visitDetail: { fontSize: 12, color: '#666', marginTop: 4 },
  buttonsRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  editBtn: { flex: 1, backgroundColor: '#FF9500', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  editBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  visitBtn: { flex: 1, backgroundColor: '#E85D04', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  visitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 20 },
});