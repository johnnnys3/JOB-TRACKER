import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsService, ApplicationsQuery, PaginatedResponse } from '@/services/applications';
import { Application, CreateApplicationDto, UpdateApplicationDto } from '@/types';

export const useApplications = (params: ApplicationsQuery = {}) => {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => applicationsService.getAll(params),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsService.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationDto) => applicationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationDto }) =>
      applicationsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useAddApplicationTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, tagId }: { applicationId: string; tagId: string }) =>
      applicationsService.addTag(applicationId, tagId),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
  });
};

export const useRemoveApplicationTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, tagId }: { applicationId: string; tagId: string }) =>
      applicationsService.removeTag(applicationId, tagId),
    onSuccess: (_, { applicationId }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
    },
  });
};
