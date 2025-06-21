import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const { isDark } = useTheme();

  const handleBack = () => {
    router.back();
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const features = [
    {
      icon: 'calendar-outline',
      title: 'Smart Scheduling',
      description: 'Intelligent reminder system that helps you never miss important deadlines and assignments.',
    },
    {
      icon: 'notifications-outline',
      title: 'Push Notifications',
      description: 'Real-time notifications to keep you informed about upcoming tasks and deadlines.',
    },
    {
      icon: 'school-outline',
      title: 'College-Focused',
      description: 'Designed specifically for college students with categories for assignments, exams, and meetings.',
    },
    {
      icon: 'moon-outline',
      title: 'Dark Mode',
      description: 'Beautiful dark and light themes to match your preference and reduce eye strain.',
    },
    {
      icon: 'cloud-outline',
      title: 'Data Persistence',
      description: 'Your reminders are safely stored locally with SQLite database for reliability.',
    },
    {
      icon: 'speedometer-outline',
      title: 'Priority System',
      description: 'Organize your tasks by priority levels: Low, Medium, and High importance.',
    },
  ];

  const teamMembers = [
    {
      name: 'Development Team',
      role: 'Full-Stack Development',
      description: 'Passionate developers creating tools to help students succeed.',
    },
    {
      name: 'Design Team',
      role: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user experiences.',
    },
    {
      name: 'QA Team',
      role: 'Quality Assurance',
      description: 'Ensuring the app works flawlessly for all users.',
    },
  ];

  const stats = [
    { label: 'Version', value: '1.0.0' },
    { label: 'Platform', value: 'React Native' },
    { label: 'Database', value: 'SQLite' },
    { label: 'Release Date', value: 'July 2025' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[
          styles.header,
          { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)' }
        ]}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              About
            </Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <View style={styles.content}>
          {/* App Logo & Title */}
          <Card variant="elevated" style={styles.section}>
            <View style={styles.appHeader}>
              <View style={[
                styles.appLogo,
                { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
              ]}>
                <Ionicons name="school" size={48} color="#0ea5e9" />
              </View>
              <Text style={[styles.appName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                Smart College Reminder
              </Text>
              <Text style={[styles.appTagline, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                Your Academic Success Companion
              </Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v1.0.0</Text>
              </View>
            </View>
          </Card>

          {/* App Description */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              About the App
            </Text>
            <Text style={[styles.description, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              Smart College Reminder is a modern, intuitive reminder application designed specifically for college students. 
              Our mission is to help students stay organized, manage their academic responsibilities, and never miss important 
              deadlines again.
            </Text>
            <Text style={[styles.description, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              Built with React Native and powered by SQLite, the app provides a seamless experience across devices while 
              ensuring your data is always safe and accessible offline.
            </Text>
          </Card>

          {/* Key Features */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Key Features
            </Text>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={[
                    styles.featureIcon,
                    { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
                  ]}>
                    <Ionicons name={feature.icon as any} size={24} color="#0ea5e9" />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={[styles.featureTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                      {feature.title}
                    </Text>
                    <Text style={[styles.featureDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Technical Specifications */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Technical Specifications
            </Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={[
                  styles.statItem,
                  { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)' }
                ]}>
                  <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Development Team */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Development Team
            </Text>
            <Text style={[styles.description, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              Smart College Reminder is developed by a passionate team of developers, designers, and educators
              who understand the challenges students face in managing their academic responsibilities.
            </Text>
            <View style={styles.teamGrid}>
              {teamMembers.map((member, index) => (
                <View key={index} style={[
                  styles.teamMember,
                  { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)' }
                ]}>
                  <Text style={[styles.memberName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    {member.name}
                  </Text>
                  <Text style={[styles.memberRole, { color: '#0ea5e9' }]}>
                    {member.role}
                  </Text>
                  <Text style={[styles.memberDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                    {member.description}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Privacy & Security */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Privacy & Security
            </Text>
            <View style={styles.privacySection}>
              <View style={styles.privacyItem}>
                <Ionicons name="shield-checkmark" size={24} color="#22c55e" />
                <View style={styles.privacyContent}>
                  <Text style={[styles.privacyTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    Local Data Storage
                  </Text>
                  <Text style={[styles.privacyDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                    All your data is stored locally on your device using SQLite database. We don't collect or store your personal information on external servers.
                  </Text>
                </View>
              </View>

              <View style={styles.privacyItem}>
                <Ionicons name="lock-closed" size={24} color="#3b82f6" />
                <View style={styles.privacyContent}>
                  <Text style={[styles.privacyTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    Secure Authentication
                  </Text>
                  <Text style={[styles.privacyDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                    Your account credentials are securely encrypted and stored locally. We use industry-standard security practices.
                  </Text>
                </View>
              </View>

              <View style={styles.privacyItem}>
                <Ionicons name="eye-off" size={24} color="#8b5cf6" />
                <View style={styles.privacyContent}>
                  <Text style={[styles.privacyTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    No Data Tracking
                  </Text>
                  <Text style={[styles.privacyDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                    We don't track your usage patterns or collect analytics data. Your privacy is our priority.
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Contact & Support */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Contact & Support
            </Text>
            <Text style={[styles.description, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              We're here to help! If you have questions, suggestions, or need support, don't hesitate to reach out.
            </Text>

            <View style={styles.contactGrid}>
              <TouchableOpacity
                style={[styles.contactItem, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)' }]}
                onPress={() => handleOpenLink('mailto:officialeric994@gmail.com')}
              >
                <Ionicons name="mail" size={24} color="#0ea5e9" />
                <Text style={[styles.contactLabel, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                  Email Support
                </Text>
                <Text style={[styles.contactValue, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  officialeric994@gmail.com
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.contactItem, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)' }]}
                onPress={() => router.push('/feedback')}
              >
                <Ionicons name="chatbubble" size={24} color="#10b981" />
                <Text style={[styles.contactLabel, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                  Send Feedback
                </Text>
                <Text style={[styles.contactValue, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  Share your thoughts
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Acknowledgments */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Acknowledgments
            </Text>
            <Text style={[styles.description, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              We would like to thank the open-source community and the following technologies that made this app possible:
            </Text>

            <View style={styles.techStack}>
              <View style={styles.techItem}>
                <Text style={[styles.techName, { color: isDark ? '#ffffff' : '#0f172a' }]}>React Native</Text>
                <Text style={[styles.techDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>Cross-platform mobile framework</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={[styles.techName, { color: isDark ? '#ffffff' : '#0f172a' }]}>Expo</Text>
                <Text style={[styles.techDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>Development platform and tools</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={[styles.techName, { color: isDark ? '#ffffff' : '#0f172a' }]}>SQLite</Text>
                <Text style={[styles.techDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>Local database storage</Text>
              </View>
              <View style={styles.techItem}>
                <Text style={[styles.techName, { color: isDark ? '#ffffff' : '#0f172a' }]}>TypeScript</Text>
                <Text style={[styles.techDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>Type-safe JavaScript</Text>
              </View>
            </View>
          </Card>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: isDark ? '#64748b' : '#94a3b8' }]}>
              Made with ❤️ for college students everywhere
            </Text>
            <Text style={[styles.footerText, { color: isDark ? '#64748b' : '#94a3b8' }]}>
              © 2025 Smart College Reminder. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  section: {
    paddingVertical: 24,
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  appLogo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  versionBadge: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  versionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '400',
  },
  featuresGrid: {
    gap: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: (width - 72) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  teamGrid: {
    gap: 16,
  },
  teamMember: {
    padding: 20,
    borderRadius: 16,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  privacySection: {
    gap: 20,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  contactGrid: {
    gap: 16,
  },
  contactItem: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
  techStack: {
    gap: 16,
  },
  techItem: {
    paddingVertical: 8,
  },
  techName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  techDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});
