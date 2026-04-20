import { api } from './api';
import { AnalyticsData } from '@/types';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsData> {
    return api.get<AnalyticsData>('/analytics/summary');
  },

  async getTrends(): Promise<{ date: string; count: number }[]> {
    return api.get<{ date: string; count: number }[]>('/analytics/trends');
  },
};
