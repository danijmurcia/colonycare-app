import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
import type { VisitRequest } from '../types';

interface PendingPhoto {
  uri: string;
  fileName: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  progress: number;
}

export default function NewVisitScreen() {
  const route = useRoute<RouteProp<ColoniesStackParamList, 'visit-new'>>();
  const navigation = useNavigation<NativeStackNavigationProp<ColoniesStackParamList>>();
  const toast = useToast();
  const { colonyId } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [loadingPicker, setLoadingPicker] = useState(false);

  const compressAndAdd = async (uri: string) => {
    try {
      const c = await imageCompressionService.compressImage(uri);
      setPendingPhotos((p) => [...p, { uri: c.uri, fileName: 'photo_' + Date.now() + '.jpg', status: 'pending', progress: 0 }]);
    } catch (e: any) {
      toast.show(e.message, { type: 'danger' });
    }
  };

  const handlePickPhoto = () => {
    if (pendingPhotos.length >= 2) {
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
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.8 });
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
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', allowsEditing: true, aspect: [4, 3], quality: 0.8 });
      if (!result.canceled && result.assets[0]) await compressAndAdd(result.assets[0].uri);
    } finally {
      setLoadingPicker(false);
    }
  };

  const handleSubmit = async (visitData: VisitRequest) => {
    try {
      const resp = await visitService.create(colonyId, visitData);
      const vid = resp.data.id;
      if (pendingPhotos.length > 0) {
        setUploadingPhotos(true);
        const upd = [...pendingPhotos];
        for (let i = 0; i < upd.length; i++) {
          try {
            upd[i].status = 'uploading';
            setPendingPhotos([...upd]);
            await photoService.upload(colonyId, vid, upd[i].uri, upd[i].fileName, (p) => {
              upd[i].progress = p;
              setPendingPhotos([...upd]);
            });
            upd[i].status = 'success';
            upd[i].progress = 100;
          } catch (e: any) {
            upd[i].status = 'error';
            upd[i].error = e.message || 'Error';
          }
          setPendingPhotos([...upd]);
        }
      }
      setTimeout(() => {
        toast.show('Visita guardada', { type: 'success' });
        navigation.goBack();
      }, 500);
    } catch (error) {
      setUploadingPhotos(false);
      toast.show(getErrorMessage(error, 'Error'), { type: 'danger' });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <View className="flex-row justify-between items-center px-4 py-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-base text-[#E85D04] font-bold">← Volver</Text>
          </TouchableOpacity>
          <Text className="text-lg font-black text-[#1A1A2E]">Nueva visita</Text>
          <View />
        </View>
        <ScrollView ref={scrollViewRef} className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-4 mb-4">
          <Text className="text-base font-semibold text-[#1A1A2E] mb-3">📷 Fotos ({pendingPhotos.length}/2)</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {pendingPhotos.map((p, i) => (
              <View key={i} className="relative">
                <Image source={{ uri: p.uri }} style={{ width: 90, height: 90, borderRadius: 8 }} />
                {p.status === 'uploading' && <View className="absolute inset-0 bg-black/40 rounded-lg items-center justify-center"><ActivityIndicator color="#fff" /></View>}
                {p.status === 'success' && <View className="absolute top-1 right-1 bg-green-600 rounded-full w-5 h-5 items-center justify-center"><Text className="text-white text-xs font-bold">✓</Text></View>}
                {p.status === 'error' && <View className="absolute top-1 right-1 bg-red-600 rounded-full w-5 h-5 items-center justify-center"><Text className="text-white text-xs font-bold">✕</Text></View>}
                {p.status === 'pending' && <TouchableOpacity onPress={() => setPendingPhotos((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-600 rounded-full w-5 h-5 items-center justify-center"><Text className="text-white text-xs font-bold">✕</Text></TouchableOpacity>}
              </View>
            ))}
            {pendingPhotos.length < 2 && (
              <TouchableOpacity disabled={loadingPicker} onPress={handlePickPhoto} className="w-24 h-24 border-2 border-[#E85D04] rounded-lg items-center justify-center bg-white">
                {loadingPicker ? <ActivityIndicator size="small" color="#E85D04" /> : <Text className="text-3xl text-[#E85D04] font-bold">+</Text>}
              </TouchableOpacity>
            )}
          </View>
          {uploadingPhotos && pendingPhotos.some((p) => p.status === 'uploading' || p.status === 'error') && (
            <View className="gap-2">
              {pendingPhotos.map((p, i) => <UploadProgress key={i} fileName={p.fileName} progress={p.progress} status={p.status} errorMessage={p.error} />
              )}
            </View>
          )}
        </View>
        <VisitFormScreen title="Nueva visita" onSubmit={handleSubmit} submitLabel="Guardar visita" scrollViewRef={scrollViewRef} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
