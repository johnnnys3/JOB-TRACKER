import { api } from './api';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
  message: string;
}

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', userData);
  },

  async logout(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/auth/logout');
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    return api.get<AuthResponse['user']>('/auth/me');
  },
};
