import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
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

  if (loading) return <View className="flex-1 justify-center items-center"><ActivityIndicator size="large" color="#E85D04" /></View>;

  if (!colony) return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <TouchableOpacity className="p-1" onPress={() => navigation.goBack()}>
        <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
      </TouchableOpacity>
      <Text className="text-sm text-gray-400 text-center mt-5">No se pudo cargar la colonia</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-lg font-black text-[#1A1A2E] flex-1 text-center">{colony.name}</Text>
        <View />
      </View>
      <ScrollView className="flex-1 px-4 py-3">
        <View className="bg-white rounded-xl p-4 mb-3">
          <Text className="text-sm text-gray-400 font-semibold mb-1">📍 Localizacion</Text>
          <Text className="text-base font-bold text-[#1A1A2E]">{colony.location}</Text>
        </View>
        <View className="bg-white rounded-xl p-4 mb-3">
          <Text className="text-sm text-gray-400 font-semibold mb-1">🐱 Gatos estimados</Text>
          <Text className="text-base font-bold text-[#1A1A2E]">{colony.estimated_cats || 0}</Text>
        </View>
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity className="flex-1 bg-orange-400 rounded-xl py-3 items-center" onPress={() => navigation.navigate('colony-edit', { colonyId })}>
            <Text className="text-white text-sm font-bold">✎ Editar colonia</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-[#E85D04] rounded-xl py-3 items-center" onPress={() => navigation.navigate('visit-new', { colonyId })}>
            <Text className="text-white text-sm font-bold">+ Registrar visita</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-5">
          <Text className="text-base font-bold text-[#1A1A2E] mb-3">📋 Historial de visitas ({visits.length})</Text>
          {visits.length === 0 ? (
            <Text className="text-sm text-gray-400 italic">Sin visitas registradas</Text>
          ) : (
            <FlatList
              data={visits}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="bg-white rounded-lg p-3 mb-2"
                  onPress={() => navigation.navigate('visit-detail', { visit: item })}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-[#E85D04]">
                        {new Date(item.date).toLocaleDateString('es-ES')}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">
                        {item.cats_seen || 0} gatos · {item.notes || 'Sin notas'}
                      </Text>
                    </View>
                    <Text className="text-xs font-semibold text-gray-400 text-right w-2/5">
                      {item.user?.first_name} {item.user?.last_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, i) => String(i)}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}