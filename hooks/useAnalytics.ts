import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { AnalyticsData } from '@/types';

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsService.getSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAnalyticsTrends = () => {
  return useQuery({
    queryKey: ['analytics', 'trends'],
    queryFn: () => analyticsService.getTrends(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
