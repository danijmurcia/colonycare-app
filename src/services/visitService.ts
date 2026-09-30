import httpManager from './HttpManager';
import type { ApiResponse, Visit, VisitRequest } from '../types';

export const visitService = {
  getByColony: async (colonyId: number): Promise<Visit[]> => {
    const response = await httpManager.get<ApiResponse<Visit[]>>(`/colonies/${colonyId}/visits`);
    return response.data.data;
  },

  getById: async (colonyId: number, visitId: number): Promise<Visit> => {
    const response = await httpManager.get<ApiResponse<Visit>>(`/colonies/${colonyId}/visits/${visitId}`);
    return response.data.data;
  },

  create: async (colonyId: number, data: VisitRequest): Promise<ApiResponse<Visit>> => {
    const response = await httpManager.post<ApiResponse<Visit>>(`/colonies/${colonyId}/visits`, data);
    return response.data;
  },

  delete: async (colonyId: number, visitId: number): Promise<string> => {
    const response = await httpManager.delete<ApiResponse<null>>(`/colonies/${colonyId}/visits/${visitId}`);
    return response.data.message;
  },

  update: async (colonyId: number, visitId: number, data: VisitRequest): Promise<Visit> => {
    const response = await httpManager.put<ApiResponse<Visit>>(`/colonies/${colonyId}/visits/${visitId}`, data);
    return response.data.data;
  },
};
