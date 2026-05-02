import { api } from './api';
import { ApiResponse } from '@/types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    createdAt: string;
    updatedAt?: string;
  };
}

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    return api.post<{ data: null; message: string }>('/auth/logout');
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await api.get<ApiResponse<AuthResponse['user']>>('/auth/me');
    return response.data;
  },
};
