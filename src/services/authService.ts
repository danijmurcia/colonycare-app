import httpManager from './HttpManager';
import type { ApiResponse, LoginResponse, RegisterRequest, RegisterResponse, UserProfile } from '../types';

export type { UserProfile, LoginResponse, RegisterRequest, RegisterResponse };

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
    const response = await httpManager.get<ApiResponse<UserProfile>>('/auth/me');
    return response.data.data;
  },

  updateMe: async (data: { first_name?: string; last_name?: string; phone?: string }): Promise<UserProfile> => {
    const response = await httpManager.put<ApiResponse<UserProfile>>('/auth/me', data);
    return response.data.data;
  },
};
