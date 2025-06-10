import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuthContext } from '../contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { 
    redirectTo = '/auth/login', 
    requireAuth = true 
  } = options;
  
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't
      router.replace(redirectTo);
    } else if (!requireAuth && isAuthenticated) {
      // User shouldn't be authenticated but is (e.g., on login page when already logged in)
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, redirectTo, requireAuth]);

  return {
    isAuthenticated,
    isLoading,
    canAccess: requireAuth ? isAuthenticated : !isAuthenticated
  };
};

// Specific hooks for common use cases
export const useRequireAuth = (redirectTo?: string) => {
  return useAuthGuard({ requireAuth: true, redirectTo });
};

export const useRequireGuest = (redirectTo?: string) => {
  return useAuthGuard({ requireAuth: false, redirectTo: redirectTo || '/(tabs)' });
};
