import { api } from './api';
import { AnalyticsData, ApiResponse } from '@/types';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsData> {
    const response = await api.get<ApiResponse<AnalyticsData>>('/analytics/summary');
    return response.data;
  },

  async getTrends(): Promise<{ date: string; count: number }[]> {
    return api.get<{ date: string; count: number }[]>('/analytics/trends');
  },
};
