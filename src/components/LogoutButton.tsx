import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useAuth } from '../context/AuthContext';

interface LogoutButtonProps {
  variant?: 'header' | 'footer';
}

export default function LogoutButton({ variant = 'footer' }: LogoutButtonProps) {
  const { logout } = useAuth();
  const toast = useToast();
  const [visible, setVisible] = useState(false);

  const handleConfirm = async () => {
    setVisible(false);
    try {
      await logout();
    } catch {
      toast.show('Error al cerrar sesión', { type: 'danger', duration: 2000 });
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <TouchableOpacity
          className="bg-orange-600 rounded-lg px-3 py-1.5 items-center justify-center"
          onPress={() => setVisible(true)}
        >
          <Text className="text-white text-xs font-bold">🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="bg-red-600 rounded-lg py-3.5 mx-4 mb-5 items-center"
          onPress={() => setVisible(true)}
        >
          <Text className="text-white text-base font-bold">🚪 Cerrar sesión</Text>
        </TouchableOpacity>
      )}

      <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full">
            <Text className="text-lg font-black text-[#1A1A2E] mb-2">Cerrar sesión</Text>
            <Text className="text-sm text-gray-500 mb-6">¿Estás seguro de que deseas cerrar sesión?</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
                onPress={() => setVisible(false)}
              >
                <Text className="text-gray-600 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-600 rounded-xl py-3 items-center"
                onPress={handleConfirm}
              >
                <Text className="text-white font-bold">Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
