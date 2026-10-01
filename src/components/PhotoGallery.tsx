import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import type { VisitPhoto } from '../types';
import { photoService } from '../services/photoService';
import PhotoViewerModal from './PhotoViewerModal';

interface PhotoGalleryProps {
  photos: VisitPhoto[];
  colonyId: number;
  visitId: number;
  canDelete: boolean;
  onPhotoDeleted: (photoId: number) => void;
}

export default function PhotoGallery({
  photos,
  colonyId,
  visitId,
  canDelete,
  onPhotoDeleted,
}: PhotoGalleryProps) {
  const toast = useToast();
  const [deleting, setDeleting] = useState<number | null>(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
        <Text className="text-xs text-[#999] font-semibold mb-2">📷 Fotos</Text>
        <Text className="text-sm text-[#999]">Sin fotos aún</Text>
      </View>
    );
  }

  const handleDelete = async (photoId: number) => {
    setDeleting(photoId);
    try {
      await photoService.delete(colonyId, visitId, photoId);
      toast.show('Foto eliminada', { type: 'success', duration: 2000 });
      onPhotoDeleted(photoId);
    } catch (error) {
      toast.show('Error al eliminar foto', { type: 'danger', duration: 2000 });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-5 mb-3 border border-[#F0F0F0]">
      <Text className="text-xs text-[#999] font-semibold mb-4">📷 Fotos ({photos.length})</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
        {photos.map((photo, index) => (
          <View key={photo.id} style={{ position: 'relative', marginRight: 12 }}>
            <TouchableOpacity onPress={() => { setSelectedPhotoIndex(index); setViewerVisible(true); }}>
              <Image
                source={{ uri: photo.photo_url }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 8,
                  backgroundColor: '#F0F0F0',
                }}
              />
            </TouchableOpacity>
            {canDelete && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  backgroundColor: '#DC2626',
                  borderRadius: 99,
                  width: 24,
                  height: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => handleDelete(photo.id)}
                disabled={deleting === photo.id}
              >
                {deleting === photo.id ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>✕</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      <PhotoViewerModal visible={viewerVisible} photos={photos} initialIndex={selectedPhotoIndex} onClose={() => setViewerVisible(false)} />
    </View>
  );
}
