import httpManager from './HttpManager';

export interface LoginResponse {
  message: string;
  user_id: number;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await httpManager.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};
