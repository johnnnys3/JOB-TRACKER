import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewsService } from '@/services/interviews';
import { CreateInterviewDto, UpdateInterviewDto } from '@/types';

export const useInterviews = (applicationId: string) => {
  return useQuery({
    queryKey: ['interviews', applicationId],
    queryFn: () => interviewsService.getByApplicationId(applicationId),
    enabled: !!applicationId,
    staleTime: 60 * 1000,
  });
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, data }: { applicationId: string; data: CreateInterviewDto }) =>
      interviewsService.create(applicationId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['interviews', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interviewId, data, applicationId }: { interviewId: string; data: UpdateInterviewDto; applicationId: string }) =>
      interviewsService.update(interviewId, data),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['interviews', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ interviewId, applicationId }: { interviewId: string; applicationId: string }) =>
      interviewsService.delete(interviewId),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['interviews', applicationId] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
  });
};
