import httpManager from './HttpManager';
import type { ApiResponse, VisitPhoto } from '../types';

export const photoService = {
  upload: async (
    colonyId: number,
    visitId: number,
    fileUri: string,
    fileName: string,
    onProgress?: (progress: number) => void,
  ): Promise<VisitPhoto> => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'image/jpeg',
      } as unknown as Blob);

      onProgress?.(0);
      const response = await httpManager.post<ApiResponse<VisitPhoto>>(
        `/colonies/${colonyId}/visits/${visitId}/photos`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      onProgress?.(100);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Error subiendo foto');
    }
  },

  delete: async (
    colonyId: number,
    visitId: number,
    photoId: number,
  ): Promise<string> => {
    const response = await httpManager.delete<ApiResponse<null>>(
      `/colonies/${colonyId}/visits/${visitId}/photos/${photoId}`,
    );
    return response.data.message;
  },
};
