import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen1() {
  const { isDark } = useTheme();

  const handleNext = () => {
    router.push('/onboarding/step2');
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
            { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
          ]}>
            <View style={[
              styles.iconInner,
              { backgroundColor: isDark ? '#0ea5e9' : '#38bdf8' }
            ]}>
              <Ionicons 
                name="notifications" 
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
            Never Miss Important{'\n'}Dates Again
          </Text>

          {/* Description */}
          <Text style={[
            styles.description,
            { color: isDark ? '#cbd5e1' : '#475569' }
          ]}>
            Stay on top of your college schedule with smart reminders for assignments, exams, meetings, and more. Get notified at the perfect time.
          </Text>

          {/* Feature Pills */}
          <View style={styles.features}>
            {['Smart Notifications', 'Easy Organization', 'Never Forget'].map((feature, index) => (
              <View 
                key={index}
                style={[
                  styles.featurePill,
                  { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
                ]}
              >
                <Text style={[
                  styles.featureText,
                  { color: isDark ? '#38bdf8' : '#0284c7' }
                ]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {/* Page Indicators */}
          <View style={styles.indicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={[styles.indicator, styles.inactiveIndicator]} />
            <View style={[styles.indicator, styles.inactiveIndicator]} />
          </View>

          {/* Next Button */}
          <Button
            title="Get Started"
            variant="gradient"
            size="lg"
            onPress={handleNext}
            rightIcon={<Ionicons name="arrow-forward" size={20} color="white" />}
            style={styles.nextButton}
          />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  iconInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    fontWeight: '500',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  featurePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navigation: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 8,
  },
  indicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: '#0ea5e9',
  },
  inactiveIndicator: {
    backgroundColor: 'rgba(148, 163, 184, 0.3)',
  },
  nextButton: {
    width: width - 64,
  },
});
