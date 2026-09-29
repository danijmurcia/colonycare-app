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

export default function NewVisitScreen() {
  const route = useRoute<RouteProp<ColoniesStackParamList, 'visit-new'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { colonyId } = route.params;

  const handleSubmit = async (data: VisitRequest) => {
    try {
      const response = await visitService.create(colonyId, data);
      toast.show(response.message, { type: 'success', duration: 2000 });
      navigation.goBack();
    } catch (error) {
      toast.show(getErrorMessage(error, 'Error al registrar la visita'), { type: 'danger', duration: 2000 });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row justify-between items-center px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-lg font-black text-[#1A1A2E]">Nueva visita</Text>
        <View />
      </View>
      <VisitFormScreen title="Nueva visita" onSubmit={handleSubmit} submitLabel="Guardar visita" />
    </SafeAreaView>
  );
}
