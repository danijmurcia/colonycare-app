import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, useFocusEffect, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from 'react-native-toast-notifications';
import { ColoniesStackParamList } from '../navigation/types';
import { visitService } from '../services/visitService';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errorHandler';
import DeleteVisitModal from '../components/DeleteVisitModal';
import PhotoGallery from '../components/PhotoGallery';
import { photoService } from '../services/photoService';
import type { Visit } from '../types';

export default function VisitDetailScreen() {
  const route = useRoute<RouteProp<ColoniesStackParamList, 'visit-detail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { user } = useAuth();
  const { visitId, colonyId } = route.params;

  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);


  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      visitService.getById(colonyId, visitId)
        .then((data) => { if (active) setVisit(data); })
        .catch((error) => {
          toast.show(getErrorMessage(error, 'Error al cargar la visita'), { type: 'danger', duration: 2000 });
        })
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, [visitId, colonyId])
  );

  const handleDeleteConfirm = async () => {
    if (!visit) return;
    try {
      setDeleting(true);
      setDeleteModalVisible(false);
      await visitService.delete(colonyId, visit.id);
      toast.show('Visita eliminada correctamente', { type: 'success', duration: 2000 });
      navigation.goBack();
    } catch (error) {
      toast.show(getErrorMessage(error, 'Error al eliminar la visita'), { type: 'danger', duration: 2000 });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5] justify-center items-center">
        <ActivityIndicator size="large" color="#E85D04" />
      </SafeAreaView>
    );
  }

  if (!visit) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5F5F5]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-base text-[#E85D04] font-bold mx-4 my-3">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-sm text-[#999] text-center mt-5">No se pudo cargar la visita</Text>
      </SafeAreaView>
    );
  }

  const isOwner = visit.user_id != null && user?.id === visit.user_id;
  const canEdit = !!user && (user.is_superuser || isOwner);
  const canDelete = !!user && (user.is_superuser || isOwner);

  const fecha = new Date(visit.date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const hora = new Date(visit.date).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit',
  });
  const firstName = visit.user?.first_name ?? '';
  const lastName = visit.user?.last_name ?? '';
  const fullName = (firstName + ' ' + lastName).trim();
  const userName = visit.user ? (fullName || visit.user.email) : 'Desconocido';

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

        {visit.wet_food_cans != null && (
          <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
            <Text className="text-xs text-[#999] font-semibold mb-2">🧫 Latas de comida húmeda</Text>
            <Text className="text-3xl font-black text-[#E85D04]">{visit.wet_food_cans}</Text>
          </View>
        )}

        <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
          <Text className="text-xs text-[#999] font-semibold mb-2">👤 Registrado por</Text>
          <Text className="text-base font-bold text-[#1A1A2E]">{userName}</Text>
          {visit.user?.phone && (
            <Text className="text-sm font-semibold text-[#1A1A2E] mt-1">{visit.user.phone}</Text>
          )}
        </View>

        {visit.notes && (
          <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
            <Text className="text-xs text-[#999] font-semibold mb-2">📝 Notas</Text>
            <Text className="text-sm text-[#666]" style={{ lineHeight: 22 }}>{visit.notes}</Text>
          </View>
        )}

        {visit.photos && visit.photos.length > 0 && (
          <PhotoGallery
            photos={visit.photos}
            colonyId={colonyId}
            visitId={visit.id}
            canDelete={false}
            onPhotoDeleted={(photoId) => {
              setVisit((prev) => prev ? { ...prev, photos: prev.photos.filter((p) => p.id !== photoId) } : null);
            }}
          />
        )}

        {canEdit && (
          <TouchableOpacity
            className="bg-[#E85D04] rounded-2xl py-4 items-center mb-3"
            onPress={() => navigation.navigate('visit-edit', { colonyId, visitId: visit.id })}
          >
            <Text className="text-white text-base font-bold">✏️ Editar visita</Text>
          </TouchableOpacity>
        )}
        {canDelete && (
          <TouchableOpacity
            className={`bg-red-600 rounded-2xl py-4 items-center mb-8${deleting ? ' opacity-60' : ''}`}
            onPress={() => setDeleteModalVisible(true)}
            disabled={deleting}
          >
            {deleting
              ? <ActivityIndicator color="#FFF" />
              : <Text className="text-white text-base font-bold">🗑 Eliminar visita</Text>
            }
          </TouchableOpacity>
        )}
      </ScrollView>

      <DeleteVisitModal
        visible={deleteModalVisible}
        visitDate={fecha}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}

