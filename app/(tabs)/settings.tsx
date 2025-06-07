import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const { isDark, toggleColorScheme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [emailReminders, setEmailReminders] = React.useState(false);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleFeedback = () => {
    router.push('/feedback');
  };

  const handleAbout = () => {
    Alert.alert(
      'About Smart College Reminder',
      'Version 1.0.0\n\nA modern reminder app designed for college students to stay organized and never miss important deadlines.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/auth/login')
        }
      ]
    );
  };

  const settingsItems = [
    {
      title: 'Profile',
      subtitle: 'Manage your account information',
      icon: 'person-outline',
      onPress: handleProfile,
      showArrow: true,
    },
    {
      title: 'Notifications',
      subtitle: 'Enable push notifications',
      icon: 'notifications-outline',
      rightComponent: (
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: '#767577', true: '#3b82f6' }}
          thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
        />
      ),
    },
    {
      title: 'Email Reminders',
      subtitle: 'Receive reminders via email',
      icon: 'mail-outline',
      rightComponent: (
        <Switch
          value={emailReminders}
          onValueChange={setEmailReminders}
          trackColor={{ false: '#767577', true: '#3b82f6' }}
          thumbColor={emailReminders ? '#ffffff' : '#f4f3f4'}
        />
      ),
    },
    {
      title: 'Sound',
      subtitle: 'Enable notification sounds',
      icon: 'volume-high-outline',
      rightComponent: (
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: '#767577', true: '#3b82f6' }}
          thumbColor={soundEnabled ? '#ffffff' : '#f4f3f4'}
        />
      ),
    },
    {
      title: 'Dark Mode',
      subtitle: 'Toggle dark/light theme',
      icon: isDark ? 'moon-outline' : 'sunny-outline',
      rightComponent: (
        <Switch
          value={isDark}
          onValueChange={toggleColorScheme}
          trackColor={{ false: '#767577', true: '#3b82f6' }}
          thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
        />
      ),
    },
    {
      title: 'Feedback',
      subtitle: 'Send us your suggestions',
      icon: 'chatbubble-outline',
      onPress: handleFeedback,
      showArrow: true,
    },
    {
      title: 'About',
      subtitle: 'App version and information',
      icon: 'information-circle-outline',
      onPress: handleAbout,
      showArrow: true,
    },
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
            <View style={[
              styles.logoContainer,
              { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
            ]}>
              <Ionicons name="settings" size={32} color="#0ea5e9" />
            </View>
            <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Settings
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              Customize your app experience
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Settings List */}
          <Card variant="elevated" style={styles.settingsCard}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                onPress={item.onPress}
                disabled={!item.onPress}
                style={[
                  styles.settingsItem,
                  index !== settingsItems.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? '#334155' : '#e2e8f0',
                  }
                ]}
              >
                <View style={[
                  styles.settingsIcon,
                  { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
                ]}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color="#0ea5e9"
                  />
                </View>

                <View style={styles.settingsContent}>
                  <Text style={[styles.settingsTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.settingsSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                    {item.subtitle}
                  </Text>
                </View>

                {item.rightComponent || (item.showArrow && (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? '#64748b' : '#94a3b8'}
                  />
                ))}
              </TouchableOpacity>
            ))}
          </Card>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <Button
              title="Logout"
              variant="outline"
              size="lg"
              onPress={handleLogout}
              leftIcon={<Ionicons name="log-out" size={20} color="#ef4444" />}
              style={[styles.logoutButton, { borderColor: '#ef4444' }]}
            />
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              Smart College Reminder
            </Text>
            <Text style={[styles.appVersion, { color: isDark ? '#64748b' : '#94a3b8' }]}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = require('react-native').StyleSheet.create({
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
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  settingsCard: {
    paddingVertical: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingsSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  logoutContainer: {
    marginTop: 32,
  },
  logoutButton: {
    borderWidth: 2,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
  },
  appVersion: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});
