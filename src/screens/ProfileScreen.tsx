import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import LogoutButton from "../components/LogoutButton";

export default function ProfileScreen() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [phone, setPhone] = useState(user?.phone || "");


  const handleEdit = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setPhone(user?.phone || "");
    setIsEditing(true);
  };

  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    if (!firstName.trim()) {
      toast.show("El nombre es obligatorio", { type: "danger" });
      return;
    }
    setIsSaving(true);
    try {
      await authService.updateMe({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
      });
      await refreshUser();
      setIsEditing(false);
      toast.show("Perfil actualizado correctamente", { type: "success" });
    } catch {
      toast.show("Error al actualizar el perfil", { type: "danger" });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="pb-5">
        <Text className="text-2xl font-black text-[#1A1A2E] px-4 py-3">Mi Perfil</Text>
        <View className="items-center mb-4"><Text className="text-8xl bg-[#E85D04] w-32 h-32 rounded-full text-center leading-32">👤</Text></View>
        <Text className="text-2xl font-black text-[#1A1A2E] text-center mb-2">{user?.first_name || "Usuario"} {user?.last_name || ""}</Text>
        {user?.is_superuser && <View className="items-center mb-5"><Text className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">SUPERADMIN</Text></View>}
        {isEditing ? (
          <View className="px-4">
            <Text className="text-lg font-black text-[#1A1A2E] mb-4">Editar perfil</Text>
            <Text className="text-xs font-semibold text-gray-500 mb-1">Nombre *</Text>
            <TextInput className="bg-white rounded-lg p-3.5 text-base text-[#1A1A2E] mb-3.5 border border-gray-300" value={firstName} onChangeText={setFirstName} placeholder="Nombre" placeholderTextColor="#999" />
            <Text className="text-xs font-semibold text-gray-500 mb-1">Apellido</Text>
            <TextInput className="bg-white rounded-lg p-3.5 text-base text-[#1A1A2E] mb-3.5 border border-gray-300" value={lastName} onChangeText={setLastName} placeholder="Apellido" placeholderTextColor="#999" />
            <Text className="text-xs font-semibold text-gray-500 mb-1">Teléfono</Text>
            <TextInput className="bg-white rounded-lg p-3.5 text-base text-[#1A1A2E] mb-3.5 border border-gray-300" value={phone} onChangeText={setPhone} placeholder="Teléfono" placeholderTextColor="#999" />
            <TouchableOpacity className={`bg-[#E85D04] rounded-lg py-3.5 items-center mb-2.5${isSaving ? ' opacity-60' : ''}`} onPress={handleSave} disabled={isSaving}>{isSaving ? <ActivityIndicator color="#FFF" /> : <Text className="text-white text-base font-bold">Guardar</Text>}</TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg py-3.5 items-center" onPress={handleCancel}><Text className="text-gray-600 text-base font-semibold">Cancelar</Text></TouchableOpacity>
          </View>
        ) : (
          <View className="px-4">
            <View className="bg-white rounded-lg p-4 mb-3 border-l-4 border-[#E85D04]"><Text className="text-xs font-semibold text-gray-400 mb-1">Email</Text><Text className="text-base font-bold text-[#1A1A2E]">{user?.email}</Text></View>
            <View className="bg-white rounded-lg p-4 mb-3 border-l-4 border-[#E85D04]"><Text className="text-xs font-semibold text-gray-400 mb-1">Estado</Text><Text className="text-base font-bold text-[#1A1A2E]">{user?.is_active ? "Activo" : "Inactivo"}</Text></View>
            {user?.phone && <View className="bg-white rounded-lg p-4 mb-3 border-l-4 border-[#E85D04]"><Text className="text-xs font-semibold text-gray-400 mb-1">Teléfono</Text><Text className="text-base font-bold text-[#1A1A2E]">{user.phone}</Text></View>}
            <TouchableOpacity className="bg-[#E85D04] rounded-lg py-3.5 items-center mt-2" onPress={handleEdit}><Text className="text-white text-base font-bold">✏️ Editar perfil</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <LogoutButton variant="footer" />
    </SafeAreaView>
  );
}
