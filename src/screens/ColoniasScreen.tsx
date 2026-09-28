import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { coloniesService } from '../services/coloniesService';

interface Colony { id: string; name: string; location: string; estimated_cats?: number; }

export default function ColoniasScreen() {
  const [colonies, setColonies] = useState<Colony[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadColonies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await coloniesService.getAll();
      setColonies(data || []);
    } catch (error) {
      console.error('Error cargando colonias:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await coloniesService.getAll();
      setColonies(data || []);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadColonies();
  }, [loadColonies]);

  const renderColony = ({ item }: { item: Colony }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('colony-detail' as never, { colonyId: item.id } as never)}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardText}>📍 {item.location}</Text>
      <Text style={styles.cardText}>🐱 {item.estimated_cats || 0} gatos</Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) return <View style={styles.centerLoader}><ActivityIndicator size="large" color="#E85D04" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Colonias</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('colony-create' as never)}>
          <Text style={styles.addBtnText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>
      {colonies.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No hay colonias aún</Text>
        </View>
      ) : (
        <FlatList
          data={colonies}
          renderItem={renderColony}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E85D04" />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#1A1A2E' },
  addBtn: { backgroundColor: '#E85D04', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  list: { paddingHorizontal: 12, paddingBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginVertical: 8, borderLeftWidth: 4, borderLeftColor: '#E85D04' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  cardText: { fontSize: 13, color: '#666', marginBottom: 4 },
  centerLoader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#999' },
});
