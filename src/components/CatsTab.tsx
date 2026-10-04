import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function CatsTab() {
  return (
    <ScrollView className="flex-1 px-4 py-8">
      <View className="items-center justify-center py-16">
        <Text className="text-5xl mb-4">🐱</Text>
        <Text className="text-xl font-bold text-[#1A1A2E] mb-2">Gestión de gatos</Text>
        <Text className="text-center text-gray-400">Próximamente podrás registrar y seguir a cada gato</Text>
      </View>
    </ScrollView>
  );
}