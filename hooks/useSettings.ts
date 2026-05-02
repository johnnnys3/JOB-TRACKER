import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { ApiResponse } from '@/types';

export interface UserSettings {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export type UpdateUserSettingsDto = Pick<UserSettings, 'email' | 'firstName' | 'lastName'>;

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async (): Promise<UserSettings> => {
      const response = await api.get<ApiResponse<UserSettings>>('/users/me');
      return response.data;
    },
    staleTime: 60 * 1000,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<UpdateUserSettingsDto>) => {
      const response = await api.patch<ApiResponse<UserSettings>>('/users/me', settings);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
