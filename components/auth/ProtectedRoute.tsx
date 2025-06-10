import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/auth/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isDark } = useTheme();

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }
      ]}>
        <ActivityIndicator 
          size="large" 
          color="#0ea5e9" 
        />
      </View>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }
      ]}>
        <ActivityIndicator 
          size="large" 
          color="#0ea5e9" 
        />
      </View>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
