import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface UploadProgressProps {
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  fileName: string;
  onRetry?: () => void;
}

export default function UploadProgress({ progress, status, errorMessage, fileName, onRetry }: UploadProgressProps) {
  return (
    <View className="bg-white rounded-lg p-3 mb-2 border border-gray-200">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-medium text-gray-700 flex-1 truncate">{fileName}</Text>
        {status === 'uploading' && <ActivityIndicator size="small" color="#E85D04" />}
        {status === 'success' && <Text className="text-green-600 font-bold">✓</Text>}
        {status === 'error' && <Text className="text-red-600 font-bold">✕</Text>}
      </View>

      {status === 'uploading' && (
        <>
          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
            <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#E85D04' }} />
          </View>
          <Text className="text-xs text-gray-500 text-right">{progress}%</Text>
        </>
      )}

      {status === 'error' && (
        <>
          <Text className="text-xs text-red-600 mb-2">{errorMessage}</Text>
          {onRetry && (
            <TouchableOpacity onPress={onRetry} className="bg-red-600 rounded px-3 py-1 self-start">
              <Text className="text-white text-xs font-bold">Reintentar</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
