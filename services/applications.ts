import { api } from './api';
import { ApiResponse, Application, CreateApplicationDto, UpdateApplicationDto } from '@/types';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApplicationsQuery {
  page?: number;
  limit?: number;
  status?: string;
  company?: string;
  search?: string;
  dateApplied?: string;
}

export const applicationsService = {
  async getAll(params: ApplicationsQuery = {}): Promise<PaginatedResponse<Application>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.company) searchParams.append('company', params.company);
    if (params.search) searchParams.append('search', params.search);
    if (params.dateApplied) searchParams.append('dateApplied', params.dateApplied);

    const endpoint = `/applications${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<ApiResponse<PaginatedResponse<Application>>>(endpoint);
    return response.data;
  },

  async getById(id: string): Promise<Application> {
    const response = await api.get<ApiResponse<Application>>(`/applications/${id}`);
    return response.data;
  },

  async create(data: CreateApplicationDto): Promise<Application> {
    const response = await api.post<ApiResponse<Application>>('/applications', data);
    return response.data;
  },

  async update(id: string, data: UpdateApplicationDto): Promise<Application> {
    const response = await api.patch<ApiResponse<Application>>(`/applications/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<ApiResponse<Application>>(`/applications/${id}`);
    return { message: response.message };
  },

  async addTag(applicationId: string, tagId: string): Promise<Application> {
    const response = await api.post<ApiResponse<Application>>(`/applications/${applicationId}/tags/${tagId}`);
    return response.data;
  },

  async removeTag(applicationId: string, tagId: string): Promise<Application> {
    const response = await api.delete<ApiResponse<Application>>(`/applications/${applicationId}/tags/${tagId}`);
    return response.data;
  },
};
