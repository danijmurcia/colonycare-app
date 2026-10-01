import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const COMPRESSION_QUALITY = 0.7;

export const imageCompressionService = {
  validateSize: (fileSizeBytes: number): { valid: boolean; message?: string } => {
    if (fileSizeBytes > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: `Foto muy grande (${(fileSizeBytes / 1024 / 1024).toFixed(1)}MB). Máximo 5MB.`,
      };
    }
    return { valid: true };
  },

  compressImage: async (imageUri: string): Promise<{ uri: string; size: number }> => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(imageUri, [
        { resize: { width: MAX_WIDTH, height: MAX_HEIGHT } },
      ], {
        compress: COMPRESSION_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      const fileInfo = await FileSystem.getInfoAsync(manipResult.uri);
      const size = (fileInfo as any).size || 0;

      const sizeValidation = imageCompressionService.validateSize(size);
      if (!sizeValidation.valid) {
        throw new Error(sizeValidation.message);
      }

      return { uri: manipResult.uri, size };
    } catch (error) {
      throw new Error(`Error comprimiendo foto: ${error}`);
    }
  },
};