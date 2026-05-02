'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuthState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, shouldRedirect } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we've completed initial auth check and user is not authenticated
    if (shouldRedirect && typeof window !== 'undefined') {
      // Check if we're not already on login page to prevent redirect loops
      if (window.location.pathname !== '/login') {
        router.push('/login');
      }
    }
  }, [shouldRedirect, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
