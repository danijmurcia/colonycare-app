import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from 'react-native-toast-notifications';
import { visitService } from '../services/visitService';
import { getErrorMessage } from '../utils/errorHandler';
import { ColoniesStackParamList } from '../navigation/types';
import VisitFormScreen from '../components/VisitFormScreen';
import type { VisitRequest } from '../types';

export default function EditVisitScreen() {
  const route = useRoute<RouteProp<ColoniesStackParamList, 'visit-edit'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { colonyId, visit } = route.params;

  const handleSubmit = async (data: VisitRequest) => {
    try {
      await visitService.update(colonyId, visit.id, data);
      toast.show('Visita actualizada correctamente', { type: 'success', duration: 2000 });
      navigation.goBack();
    } catch (error) {
      toast.show(getErrorMessage(error, 'Error al actualizar la visita'), { type: 'danger', duration: 2000 });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-lg font-black text-[#1A1A2E]">Editar visita</Text>
        <View />
      </View>
      <VisitFormScreen initialValues={{ cats_seen: visit.cats_seen, food_grams: visit.food_grams, wet_food_cans: visit.wet_food_cans, notes: visit.notes }} onSubmit={handleSubmit} submitLabel="Actualizar visita" />
    </SafeAreaView>
  );
}
