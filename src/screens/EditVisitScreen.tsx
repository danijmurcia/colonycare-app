import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useToast } from 'react-native-toast-notifications';
import { visitService } from '../services/visitService';
import { photoService } from '../services/photoService';
import { imageCompressionService } from '../services/imageCompressionService';
import { getErrorMessage } from '../utils/errorHandler';
import { ColoniesStackParamList } from '../navigation/types';
import VisitFormScreen from '../components/VisitFormScreen';
import UploadProgress from '../components/UploadProgress';
import type { Visit, VisitRequest } from '../types';

interface PendingPhoto {
  uri: string;
  fileName: string;
  state: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

export default function EditVisitScreen() {
  const route = useRoute<RouteProp<ColoniesStackParamList, 'visit-edit'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { colonyId, visitId } = route.params;

  const scrollViewRef = useRef<ScrollView>(null);
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [loadingPicker, setLoadingPicker] = useState(false);

  useEffect(() => {
    visitService.getById(colonyId, visitId)
      .then(setVisit)
      .catch((error) => {
        toast.show(getErrorMessage(error, 'Error al cargar la visita'), { type: 'danger', duration: 2000 });
      })
      .finally(() => setLoading(false));
  }, [colonyId, visitId]);

  const compressAndAdd = async (imageUri: string) => {
    try {
      const compressed = await imageCompressionService.compressImage(imageUri);
      const fileName = `photo_${Date.now()}.jpg`;
      setPendingPhotos((prev) => [...prev, { uri: compressed, fileName, state: 'pending', progress: 0 }]);
    } catch (error) {
      toast.show(getErrorMessage(error, 'Error al procesar imagen'), { type: 'danger' });
    }
  };

  const handleSubmit = async (visitData: VisitRequest) => {
    if (!visit) return;
    try {
      await visitService.update(colonyId, visit.id, visitData);
      if (pendingPhotos.length > 0) {
        setUploadingPhotos(true);
        const updatedPhotos = pendingPhotos.map((p) => ({ ...p, state: 'uploading' as const }));
        setPendingPhotos(updatedPhotos);
        for (let i = 0; i < pendingPhotos.length; i++) {
          try {
            await photoService.upload(colonyId, visit.id, pendingPhotos[i].uri, pendingPhotos[i].fileName, (progress) => {
              setPendingPhotos((prev) => {
                const updated = [...prev];
                updated[i] = { ...updated[i], progress };
                return updated;
              });
            });
            setPendingPhotos((prev) => {
              const updated = [...prev];
              updated[i] = { ...updated[i], state: 'success' };
              return updated;
            });
          } catch (e) {
            setPendingPhotos((prev) => {
              const updated = [...prev];
              updated[i] = { ...updated[i], state: 'error' };
              return updated;
            });
          }
        }
        setTimeout(() => setPendingPhotos([]), 1500);
      }
      toast.show('Visita actualizada correctamente', { type: 'success', duration: 2000 });
      navigation.goBack();
    } catch (error) {
      setUploadingPhotos(false);
      toast.show(getErrorMessage(error, 'Error al actualizar'), { type: 'danger', duration: 2000 });
    }
  };

  const handlePickPhoto = async () => {
    const totalPhotos = (visit?.photos?.length || 0) + pendingPhotos.length;
    if (totalPhotos >= 2) {
      Alert.alert('Máximo 2 fotos', 'Ya tienes 2 fotos.');
      return;
    }
    Alert.alert('Seleccionar foto', 'Elige una opción', [
      { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
      { text: 'Cámara', onPress: () => pickFromCamera() },
      { text: 'Galería', onPress: () => pickFromGallery() },
    ]);
  };

  const pickFromCamera = async () => {
    setLoadingPicker(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'La app necesita acceso a la cámara.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3] });
      if (!result.canceled && result.assets[0]) await compressAndAdd(result.assets[0].uri);
    } finally {
      setLoadingPicker(false);
    }
  };

  const pickFromGallery = async () => {
    setLoadingPicker(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'La app necesita acceso a la galería.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [4, 3] });
      if (!result.canceled && result.assets[0]) await compressAndAdd(result.assets[0].uri);
    } finally {
      setLoadingPicker(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#E85D04" />
      </SafeAreaView>
    );
  }

  if (!visit) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="px-4 py-3">
          <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
        </TouchableOpacity>
        <Text className="text-sm text-gray-400 text-center mt-5">No se pudo cargar la visita</Text>
      </SafeAreaView>
    );
  }

  const totalPhotos = (visit?.photos?.length || 0) + pendingPhotos.length;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row justify-between items-center px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
          </TouchableOpacity>
          <Text className="text-lg font-black text-[#1A1A2E]">Editar visita</Text>
          <View />
        </View>
        <ScrollView ref={scrollViewRef} className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
          <Text className="text-xs text-[#999] font-semibold mb-4">📷 Fotos ({totalPhotos}/2)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {visit.photos?.map((photo) => (
              <View key={`existing-${photo.id}`} style={{ position: 'relative' }}>
                <Image source={{ uri: photo.photo_url }} style={{ width: 96, height: 96, borderRadius: 8, backgroundColor: '#F0F0F0' }} />
                <TouchableOpacity
                  style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#DC2626', borderRadius: 99, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => photoService.delete(colonyId, visit!.id, photo.id).then(() =>
                    setVisit((prev) => prev ? { ...prev, photos: prev.photos.filter((p) => p.id !== photo.id) } : null)
                  )}
                >
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {pendingPhotos.map((photo, idx) => (
              <View key={`pending-${idx}`} style={{ position: 'relative', width: 96, height: 96 }}>
                <Image source={{ uri: photo.uri }} style={{ width: 96, height: 96, borderRadius: 8 }} />
                <UploadProgress state={photo.state} progress={photo.progress} />
                <TouchableOpacity
                  style={{ position: 'absolute', top: 4, right: 4, backgroundColor: photo.state === 'error' ? '#DC2626' : '#FFA500', borderRadius: 99, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => setPendingPhotos((prev) => prev.filter((_, i) => i !== idx))}
                >
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            {totalPhotos < 2 && (
              <TouchableOpacity
                disabled={loadingPicker}
                style={{ width: 96, height: 96, borderRadius: 8, borderWidth: 2, borderColor: '#E85D04', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}
                onPress={handlePickPhoto}
              >
                {loadingPicker ? <ActivityIndicator size="small" color="#E85D04" /> : <Text style={{ fontSize: 28, color: '#E85D04' }}>+</Text>}
              </TouchableOpacity>
            )}
          </ScrollView>
          {uploadingPhotos && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <ActivityIndicator size="small" color="#E85D04" />
              <Text style={{ fontSize: 12, color: '#999', marginLeft: 6 }}>Subiendo fotos...</Text>
            </View>
          )}
        </View>
        <VisitFormScreen
          initialValues={{
            cats_seen: visit.cats_seen,
            food_grams: visit.food_grams,
            wet_food_cans: visit.wet_food_cans,
            notes: visit.notes,
          }}
          onSubmit={handleSubmit}
          submitLabel="Actualizar visita"
          scrollViewRef={scrollViewRef}
        />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
