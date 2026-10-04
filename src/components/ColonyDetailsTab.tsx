import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from 'react-native-toast-notifications';
import { coloniesService } from '../services/coloniesService';
import { getErrorMessage } from '../utils/errorHandler';
import { usePermissions } from '../hooks/usePermissions';
import DeleteColonyModal from './DeleteColonyModal';
import type { Colony, Visit } from '../types';
import { ColoniesStackParamList } from '../navigation/types';

interface Props {
  colony: Colony;
  visits: Visit[];
  colonyId: number;
  onColonyDeleted: () => void;
}

export default function ColonyDetailsTab({ colony, visits, colonyId, onColonyDeleted }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { canDeleteColony, canManageColonies } = usePermissions();
  const [deleting, setDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      setDeleteModalVisible(false);
      await coloniesService.delete(colonyId);
      toast.show('Colonia eliminada', { type: 'success', duration: 2000 });
      onColonyDeleted();
    } catch (error) {
      toast.show(getErrorMessage(error, 'Error al eliminar'), { type: 'danger' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ScrollView className="flex-1 px-4 py-3">
      <View className="bg-white rounded-xl p-5 mb-4">
        <Text className="text-sm text-gray-400 font-semibold mb-2">📍 Ubicación</Text>
        <Text className="text-lg font-bold text-[#1A1A2E]">{colony.location}</Text>
      </View>
      <View className="bg-white rounded-xl p-5 mb-4">
        <Text className="text-sm text-gray-400 font-semibold mb-2">🐱 Estimados</Text>
        <Text className="text-lg font-bold text-[#1A1A2E]">{colony.estimated_cats}</Text>
      </View>
      <View className="flex-row gap-3 mb-4">
        {canManageColonies && <TouchableOpacity className="flex-1 bg-orange-400 rounded-lg py-3" onPress={() => navigation.navigate('colony-edit', { colonyId })}><Text className="text-white font-bold text-center">✎ Editar</Text></TouchableOpacity>}
        <TouchableOpacity className="flex-1 bg-[#E85D04] rounded-lg py-3" onPress={() => navigation.navigate('visit-new', { colonyId })}><Text className="text-white font-bold text-center">+ Visita</Text></TouchableOpacity>
      </View>
      {canDeleteColony && <TouchableOpacity className={`bg-red-600 rounded-lg py-3 mb-6${deleting ? ' opacity-50' : ''}`} disabled={deleting} onPress={() => setDeleteModalVisible(true)}>{deleting ? <ActivityIndicator color="#FFF" /> : <Text className="text-white font-bold text-center">🗑 Eliminar</Text>}</TouchableOpacity>}
      <View className="mb-8">
        <Text className="text-lg font-bold text-[#1A1A2E] mb-3">📋 Visitas ({visits.length})</Text>
        {visits.length === 0 ? <Text className="text-gray-400">Sin visitas</Text> : <FlatList data={visits} renderItem={({ item }) => <TouchableOpacity className="bg-white rounded-lg p-3 mb-2" onPress={() => navigation.navigate('visit-detail', { visitId: item.id, colonyId })}><Text className="font-bold text-[#E85D04]">{new Date(item.date).toLocaleDateString()}</Text><Text className="text-sm text-gray-500">{item.cats_seen} gatos</Text></TouchableOpacity>} keyExtractor={(_, i) => String(i)} scrollEnabled={false} />}
      </View>
      <DeleteColonyModal visible={deleteModalVisible} colonyName={colony.name} deleting={deleting} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteModalVisible(false)} />
    </ScrollView>
  );
}