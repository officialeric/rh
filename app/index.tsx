import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  useEffect(() => {
    // For development, we'll always show onboarding first
    // In production, you'd check if user has seen onboarding and is authenticated
    const checkAuthStatus = async () => {
      // Simulate checking auth status
      setTimeout(() => {
        router.replace('/onboarding');
      }, 1000);
    };

    checkAuthStatus();
  }, []);

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
