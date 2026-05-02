import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export const useAuthState = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Only mark as checked after the initial loading is complete
    if (!isLoading) {
      setHasCheckedAuth(true);
    }
  }, [isLoading]);

  return {
    isAuthenticated,
    isLoading,
    hasCheckedAuth,
    // Only consider redirecting if we've completed initial auth check
    shouldRedirect: hasCheckedAuth && !isAuthenticated,
  };
};
