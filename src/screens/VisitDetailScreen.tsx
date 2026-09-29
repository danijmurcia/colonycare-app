import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-base text-[#E85D04] font-bold mx-4 my-3">← Volver</Text>
      </TouchableOpacity>
      <Text className="text-sm text-[#999] text-center mt-5">No se pudo cargar la visita</Text>
    </SafeAreaView>
  );

  const fecha = new Date(visit.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hora = new Date(visit.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const userName = visit.user
    ? (visit.user.first_name || visit.user.last_name)
      ? `${visit.user.first_name ?? ''} ${visit.user.last_name ?? ''}`.trim()
      : visit.user.email
    : 'Desconocido';

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text className="text-base text-[#E85D04] font-bold mx-4 my-3">← Volver</Text>
      </TouchableOpacity>
      <ScrollView className="flex-1 px-4">
        <View className="mb-7">
          <Text className="text-2xl font-black text-[#1A1A2E] mb-3">📋 Detalles de la visita</Text>
          <View className="bg-white rounded-2xl p-4 border-l-4 border-l-[#E85D04]">
            <Text className="text-sm font-bold text-[#1A1A2E] capitalize">{fecha}</Text>
            <Text className="text-xs text-[#999] mt-2">{hora}</Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
          <Text className="text-xs text-[#999] font-semibold mb-2">🐱 Gatos vistos</Text>
          <Text className="text-3xl font-black text-[#E85D04]">{visit.cats_seen || 0}</Text>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
          <Text className="text-xs text-[#999] font-semibold mb-2">🍽️ Comida seca (gramos)</Text>
          <Text className="text-3xl font-black text-[#E85D04]">{visit.food_grams || 0} g</Text>
        </View>

        {visit.wet_food_cans !== undefined && visit.wet_food_cans !== null && (
          <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
            <Text className="text-xs text-[#999] font-semibold mb-2">🥫 Latas de comida húmeda</Text>
            <Text className="text-3xl font-black text-[#E85D04]">{visit.wet_food_cans}</Text>
          </View>
        )}

        <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
          <Text className="text-xs text-[#999] font-semibold mb-2">👤 Registrado por</Text>
          <Text className="text-base font-bold text-[#1A1A2E]">{userName}</Text>
          {visit.user?.first_name || visit.user?.last_name ? (
            <Text className="text-xs text-[#999] mt-1">{visit.user.email}</Text>
          ) : null}
        </View>

        {visit.notes && (
          <View className="bg-white rounded-2xl p-5 mb-7 border border-[#F0F0F0]">
            <Text className="text-xs text-[#999] font-semibold mb-2">📝 Notas</Text>
            <Text className="text-sm text-[#666]" style={{ lineHeight: 22 }}>{visit.notes}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
