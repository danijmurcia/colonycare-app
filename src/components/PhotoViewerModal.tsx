import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, Image, useWindowDimensions, FlatList } from 'react-native';
import type { VisitPhoto } from '../types';

interface PhotoViewerModalProps {
  visible: boolean;
  photos: VisitPhoto[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoViewerModal({ visible, photos, initialIndex, onClose }: PhotoViewerModalProps) {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = React.useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black">
        <TouchableOpacity className="absolute top-16 left-6 z-10 bg-black/60 rounded-full p-4" onPress={onClose}>
          <Text className="text-white text-4xl font-bold leading-none">✕</Text>
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={photos}
          keyExtractor={(_, i) => `photo-${i}`}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <View style={{ width, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Image source={{ uri: item.photo_url }} resizeMode="contain" style={{ width: '90%', height: '90%' }} />
            </View>
          )}
        />

        <View className="absolute bottom-8 left-0 right-0 items-center">
          <Text className="text-white text-sm font-semibold">{currentIndex + 1} / {photos.length}</Text>
        </View>
      </View>
    </Modal>
  );
}
