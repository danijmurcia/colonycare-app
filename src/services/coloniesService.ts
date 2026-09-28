import httpManager from "./HttpManager";

export interface Colony {
  id: number;
  name: string;
  location: string;
  estimated_cats: number;
}

export interface Visit {
  id: number;
  colony_id: number;
  date: string;
  cats_seen: number;
  food_grams: number;
  wet_food_cans?: number;
  can_size?: "small" | "large";
  notes?: string;
}

export interface VisitRequest {
  cats_seen: number;
  food_grams: number;
  wet_food_cans?: number;
  can_size?: "small" | "large";
  notes?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const coloniesService = {
  getAll: async (): Promise<Colony[]> => {
    const response = await httpManager.get<ApiResponse<Colony[]>>("/colonies/");
    return response.data.data;
  },

  getPending: async (days: number = 3): Promise<Colony[]> => {
    const response = await httpManager.get<ApiResponse<Colony[]>>("/colonies/pending?days=" + days);
    return response.data.data;
  },

  getById: async (id: number): Promise<Colony> => {
    const response = await httpManager.get<ApiResponse<Colony>>("/colonies/" + id);
    return response.data.data;
  },

  create: async (data: Omit<Colony, "id">): Promise<Colony> => {
    const response = await httpManager.post<ApiResponse<Colony>>("/colonies/", data);
    return response.data.data;
  },

  getVisits: async (colonyId: number): Promise<Visit[]> => {
    const response = await httpManager.get<ApiResponse<Visit[]>>("/colonies/" + colonyId + "/visits");
    return response.data.data;
  },

  createVisit: async (colonyId: number, data: VisitRequest): Promise<Visit> => {
    const response = await httpManager.post<ApiResponse<Visit>>("/colonies/" + colonyId + "/visits", data);
    return response.data.data;
  },
};
