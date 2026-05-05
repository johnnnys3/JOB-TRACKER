import { api } from './api';
import { ApiResponse, CreateInterviewDto, Interview, PaginatedResponse, UpdateInterviewDto } from '@/types';

export const interviewsService = {
  getByApplicationId: async (applicationId: string): Promise<Interview[]> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Interview>>>(`/applications/${applicationId}/interviews?limit=100`);
    return response.data.data;
  },

  create: async (applicationId: string, data: CreateInterviewDto): Promise<Interview> => {
    const response = await api.post<ApiResponse<Interview>>(`/applications/${applicationId}/interviews`, data);
    return response.data;
  },

  update: async (interviewId: string, data: UpdateInterviewDto): Promise<Interview> => {
    const response = await api.patch<ApiResponse<Interview>>(`/interviews/${interviewId}`, data);
    return response.data;
  },

  delete: async (interviewId: string): Promise<void> => {
    await api.delete<ApiResponse<Interview>>(`/interviews/${interviewId}`);
  },
};
