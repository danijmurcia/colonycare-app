import type { ApiResponse } from './api';

export interface UserProfile {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface AuthContextType {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

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

export interface RegisterResponse extends ApiResponse<UserProfile> {}
