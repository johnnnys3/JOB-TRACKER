import { api } from './api';
import { ApiResponse, Tag } from '@/types';

export interface CreateTagDto {
  name: string;
}

export const tagsService = {
  getAll: async (): Promise<Tag[]> => {
    const response = await api.get<ApiResponse<Tag[]>>('/tags');
    return response.data;
  },

  create: async (data: CreateTagDto): Promise<Tag> => {
    const response = await api.post<ApiResponse<Tag>>('/tags', data);
    return response.data;
  },

  delete: async (tagId: string): Promise<void> => {
    await api.delete<ApiResponse<Tag>>(`/tags/${tagId}`);
  },
};
