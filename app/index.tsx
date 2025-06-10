import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuthContext();

  useEffect(() => {
    const initializeApp = async () => {
      // Wait for auth check to complete
      await checkAuthStatus();

      // Navigate based on authentication status
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }, 1000); // Small delay for better UX
    };

    initializeApp();
  }, []);

  // Don't navigate immediately if still loading
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View 
      className="flex-1 justify-center items-center bg-white dark:bg-secondary-900"
      style={styles.container}
    >
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
