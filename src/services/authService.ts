import httpManager from './HttpManager';

export interface LoginResponse {
  message: string;
  user_id: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await httpManager.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await httpManager.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },
};
