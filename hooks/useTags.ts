import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsService, CreateTagDto } from '@/services/tags';

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: tagsService.getAll,
    staleTime: 60 * 1000,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagDto) => tagsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: string) => tagsService.delete(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};
