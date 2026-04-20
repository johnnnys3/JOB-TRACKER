import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginDto, RegisterDto } from '@/services/auth';
import { User } from '@/types';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear();
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
