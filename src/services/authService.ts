import httpManager from './HttpManager';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
}

export interface UserProfile {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
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

  me: async (): Promise<UserProfile> => {
    const response = await httpManager.get<{ data: UserProfile }>('/auth/me');
    return response.data.data;
  },

  updateMe: async (data: { first_name?: string; last_name?: string; phone?: string }): Promise<UserProfile> => {
    const response = await httpManager.put<{ data: UserProfile }>('/auth/me', data);
    return response.data.data;
  },
};
