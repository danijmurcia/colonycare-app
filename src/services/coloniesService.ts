import httpManager from "./HttpManager";
import type { ApiResponse, Colony, ColonyCreateRequest, ColonyUpdateRequest, Visit, VisitRequest } from '../types';

export type { Colony, Visit, VisitRequest };

export const coloniesService = {
  getAll: async (): Promise<Colony[]> => {
    const response = await httpManager.get<ApiResponse<Colony[]>>('/colonies/');
    return response.data.data;
  },

  getPending: async (minDays: number = 1, maxDays?: number): Promise<Colony[]> => {
    const params = new URLSearchParams({ min_days: String(minDays) });
    if (maxDays !== undefined) params.append('max_days', String(maxDays));
    const response = await httpManager.get<ApiResponse<Colony[]>>(`/colonies/pending?${params.toString()}`);
    return response.data.data;
  },

  getById: async (id: number): Promise<Colony> => {
    const response = await httpManager.get<ApiResponse<Colony>>('/colonies/' + id);
    return response.data.data;
  },

  create: async (data: ColonyCreateRequest): Promise<Colony> => {
    const response = await httpManager.post<ApiResponse<Colony>>('/colonies/', data);
    return response.data.data;
  },

  update: async (id: number, data: ColonyUpdateRequest): Promise<Colony> => {
    const response = await httpManager.put<ApiResponse<Colony>>('/colonies/' + id, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<string> => {
    const response = await httpManager.delete<ApiResponse<null>>('/colonies/' + id);
    return response.data.message;
  },

  getVisits: async (colonyId: number): Promise<Visit[]> => {
    const response = await httpManager.get<ApiResponse<Visit[]>>('/colonies/' + colonyId + '/visits');
    return response.data.data;
  },

  createVisit: async (colonyId: number, data: VisitRequest): Promise<ApiResponse<Visit>> => {
    const response = await httpManager.post<ApiResponse<Visit>>('/colonies/' + colonyId + '/visits', data);
    return response.data;
  },
};
