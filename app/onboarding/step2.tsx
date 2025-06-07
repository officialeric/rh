import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen2() {
  const { isDark } = useTheme();

  const handleNext = () => {
    router.push('/onboarding/step3');
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
      <View style={styles.content}>
        {/* Skip Button */}
        <View style={styles.header}>
          <Button
            title="Skip"
            variant="ghost"
            size="sm"
            onPress={handleSkip}
          />
        </View>

        {/* Content */}
        <View style={styles.mainContent}>
          {/* Animated Icon Container */}
          <View style={[
            styles.iconContainer,
            { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)' }
          ]}>
            <View style={[
              styles.iconInner,
              { backgroundColor: isDark ? '#22c55e' : '#16a34a' }
            ]}>
              <Ionicons
                name="calendar"
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
            Smart Categories &{'\n'}Organization
          </Text>

          {/* Description */}
          <Text style={[
            styles.description,
            { color: isDark ? '#cbd5e1' : '#475569' }
          ]}>
            Organize your reminders by categories like assignments, exams, meetings, and personal tasks for better management and productivity.
          </Text>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {/* Page Indicators */}
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.inactiveIndicator]} />
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={[styles.indicator, styles.inactiveIndicator]} />
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
              title="Continue"
              variant="gradient"
              size="lg"
              onPress={handleNext}
              rightIcon={<Ionicons name="arrow-forward" size={20} color="white" />}
              style={styles.nextButton}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    paddingBottom: 24,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  nextButton: {
    flex: 1,
    marginLeft: 16,
  },
});
