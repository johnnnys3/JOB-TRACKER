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
      <div className="app-grid-bg flex min-h-screen items-center justify-center bg-background p-6">
        <div className="frosted-surface w-full max-w-sm rounded-3xl p-6">
          <div className="h-10 w-40 animate-pulse rounded-2xl bg-white/70" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-xl bg-white/70" />
            <div className="h-4 w-3/4 animate-pulse rounded-xl bg-white/70" />
          </div>
          <div className="mt-6 h-12 animate-pulse rounded-2xl bg-white/70" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
