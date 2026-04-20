import { api } from './api';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '@/types';

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
}

export const applicationsService = {
  async getAll(params: ApplicationsQuery = {}): Promise<PaginatedResponse<Application>> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.status) searchParams.append('status', params.status);
    if (params.company) searchParams.append('company', params.company);
    if (params.search) searchParams.append('search', params.search);

    const endpoint = `/applications${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return api.get<PaginatedResponse<Application>>(endpoint);
  },

  async getById(id: string): Promise<Application> {
    return api.get<Application>(`/applications/${id}`);
  },

  async create(data: CreateApplicationDto): Promise<Application> {
    return api.post<Application>('/applications', data);
  },

  async update(id: string, data: UpdateApplicationDto): Promise<Application> {
    return api.patch<Application>(`/applications/${id}`, data);
  },

  async delete(id: string): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/applications/${id}`);
  },

  async addTag(applicationId: string, tagId: string): Promise<Application> {
    return api.post<Application>(`/applications/${applicationId}/tags/${tagId}`);
  },

  async removeTag(applicationId: string, tagId: string): Promise<Application> {
    return api.delete<Application>(`/applications/${applicationId}/tags/${tagId}`);
  },
};
