import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsService, ApplicationsQuery } from '@/services/applications';
import { Application, CreateApplicationDto, PaginatedResponse, UpdateApplicationDto } from '@/types';

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
    onSuccess: (createdApplication) => {
      queryClient.setQueriesData<PaginatedResponse<Application>>({ queryKey: ['applications'] }, (current) => {
        if (!current) return current;
        return {
          ...current,
          data: [createdApplication, ...current.data].slice(0, current.limit),
          total: current.total + 1,
          totalPages: Math.ceil((current.total + 1) / current.limit),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationDto }) =>
      applicationsService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['application', id] });
      const previousApplication = queryClient.getQueryData<Application>(['application', id]);

      if (previousApplication) {
        queryClient.setQueryData<Application>(['application', id], {
          ...previousApplication,
          ...data,
        });
      }

      return { previousApplication };
    },
    onError: (_error, { id }, context) => {
      if (context?.previousApplication) {
        queryClient.setQueryData(['application', id], context.previousApplication);
      }
    },
    onSuccess: (updatedApplication, { id }) => {
      queryClient.setQueryData(['application', id], updatedApplication);
      queryClient.setQueriesData<PaginatedResponse<Application>>({ queryKey: ['applications'] }, (current) => {
        if (!current) return current;
        return {
          ...current,
          data: current.data.map(application =>
            application.id === id ? updatedApplication : application,
          ),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationsService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });
      const previousLists = queryClient.getQueriesData<PaginatedResponse<Application>>({ queryKey: ['applications'] });

      queryClient.setQueriesData<PaginatedResponse<Application>>({ queryKey: ['applications'] }, (current) => {
        if (!current) return current;
        const nextTotal = Math.max(current.total - 1, 0);
        return {
          ...current,
          data: current.data.filter(application => application.id !== id),
          total: nextTotal,
          totalPages: Math.ceil(nextTotal / current.limit),
        };
      });

      return { previousLists };
    },
    onError: (_error, _id, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: ['application', id] });
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
