import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen3() {
  const { isDark } = useTheme();

  const handleGetStarted = () => {
    router.push('/auth/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
      <View style={styles.content}>
        {/* Content */}
        <View style={styles.mainContent}>
          {/* Animated Icon Container */}
          <View style={[
            styles.iconContainer,
            { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)' }
          ]}>
            <View style={[
              styles.iconInner,
              { backgroundColor: isDark ? '#f59e0b' : '#d97706' }
            ]}>
              <Ionicons
                name="checkmark-circle"
                size={48}
                color="#ffffff"
              />
            </View>
          </View>

          {/* Title */}
          <Text style={[
            styles.title,
            { color: isDark ? '#ffffff' : '#0f172a' }
          ]}>
            Stay Organized &{'\n'}Never Miss Deadlines
          </Text>

          {/* Description */}
          <Text style={[
            styles.description,
            { color: isDark ? '#cbd5e1' : '#475569' }
          ]}>
            Get timely notifications, track your progress, and never miss important deadlines with our intuitive reminder system designed for students.
          </Text>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {/* Page Indicators */}
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.inactiveIndicator]} />
            <View style={[styles.indicator, styles.inactiveIndicator]} />
            <View style={[styles.indicator, styles.activeIndicator]} />
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <Button
              title="Back"
              variant="outline"
              size="md"
              onPress={handleBack}
              leftIcon={<Ionicons name="arrow-back" size={20} color="#0ea5e9" />}
              style={styles.backButton}
            />

            <Button
              title="Get Started"
              variant="gradient"
              size="lg"
              onPress={handleGetStarted}
              rightIcon={<Ionicons name="rocket" size={20} color="white" />}
              style={styles.getStartedButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  iconInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 8,
    maxWidth: width * 0.85,
  },
  navigation: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeIndicator: {
    backgroundColor: '#0ea5e9',
    width: 32,
  },
  inactiveIndicator: {
    backgroundColor: '#cbd5e1',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    flex: 0,
    minWidth: 100,
  },
  getStartedButton: {
    flex: 1,
    marginLeft: 16,
  },
});
