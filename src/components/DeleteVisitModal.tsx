import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface DeleteVisitModalProps {
  visible: boolean;
  visitDate: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteVisitModal({ visible, visitDate, deleting, onConfirm, onCancel }: DeleteVisitModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full">
          <Text className="text-lg font-black text-[#1A1A2E] mb-2">⚠️ Eliminar visita</Text>
          <Text className="text-sm text-gray-600 mb-3 font-semibold">¿Estás seguro de que deseas eliminar la visita del {visitDate}?</Text>
          <View className="bg-red-50 border-l-4 border-red-500 p-3 mb-6 rounded">
            <Text className="text-xs text-red-700 font-semibold mb-1">⚠️ Atención:</Text>
            <Text className="text-xs text-red-600 leading-5">{"• Afectará a tus estadísticas\n• No se puede deshacer"}</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
              onPress={onCancel}
              disabled={deleting}
            >
              <Text className="text-gray-600 font-semibold">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-600 rounded-xl py-3 items-center"
              onPress={onConfirm}
              disabled={deleting}
            >
              <Text className="text-white font-bold">{deleting ? 'Eliminando...' : 'Eliminar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
