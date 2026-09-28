import httpManager from "./HttpManager";

export interface Colony {
  id: number;
  name: string;
  location: string;
  estimated_cats: number;
}

export interface VisitUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Visit {
  id: number;
  colony_id: number;
  user_id?: number;
  user?: VisitUser;
  date: string;
  cats_seen: number;
  food_grams: number;
  wet_food_cans?: number;
  can_size?: 'small' | 'large';
  notes?: string;
}

export interface VisitRequest {
  cats_seen: number;
  food_grams: number;
  wet_food_cans?: number;
  can_size?: 'small' | 'large';
  notes?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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

  create: async (data: Omit<Colony, 'id'>): Promise<Colony> => {
    const response = await httpManager.post<ApiResponse<Colony>>('/colonies/', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Omit<Colony, 'id'>>): Promise<Colony> => {
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

  createVisit: async (colonyId: number, data: VisitRequest): Promise<{ message?: string; data: Visit }> => {
    const response = await httpManager.post<any>('/colonies/' + colonyId + '/visits', data);
    return {
      message: response.data.message || 'Visita registrada correctamente',
      data: response.data.data,
    };
  },
};
