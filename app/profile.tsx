import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '+1 (555) 123-4567',
    university: 'State University',
    major: 'Computer Science',
    year: 'Junior',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes here if needed
  };

  const handleBack = () => {
    router.back();
  };

  const stats = [
    { label: 'Total Reminders', value: '24', icon: 'notifications-outline' },
    { label: 'Completed', value: '18', icon: 'checkmark-circle-outline' },
    { label: 'Pending', value: '6', icon: 'time-outline' },
    { label: 'This Week', value: '8', icon: 'calendar-outline' },
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
              Profile
            </Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
              <Text style={[styles.editButtonText, { color: '#0ea5e9' }]}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Profile Picture & Basic Info */}
          <Card variant="elevated" style={styles.profileCard}>
            <View style={styles.profilePicture}>
              <Text style={styles.profileInitials}>
                {profileData.firstName[0]}{profileData.lastName[0]}
              </Text>
            </View>
            <Text style={[styles.profileName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              {profileData.firstName} {profileData.lastName}
            </Text>
            <Text style={[styles.profileInfo, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              {profileData.major} • {profileData.year}
            </Text>
            <Text style={[styles.profileUniversity, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              {profileData.university}
            </Text>
          </Card>

          {/* Stats */}
          <Card variant="elevated" style={styles.statsCard}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Statistics
            </Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={stat.label} style={styles.statItem}>
                  <View style={styles.statContent}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }]}>
                      <Ionicons
                        name={stat.icon as any}
                        size={20}
                        color="#0ea5e9"
                      />
                    </View>
                    <View style={styles.statInfo}>
                      <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                        {stat.value}
                      </Text>
                      <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        {stat.label}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Personal Information */}
          <Card>
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Personal Information
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Input
                    label="First Name"
                    value={profileData.firstName}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
                    editable={isEditing}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Last Name"
                    value={profileData.lastName}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, lastName: text }))}
                    editable={isEditing}
                  />
                </View>
              </View>

              <Input
                label="Email"
                value={profileData.email}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                editable={isEditing}
                leftIcon="mail-outline"
              />

              <Input
                label="Phone"
                value={profileData.phone}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                editable={isEditing}
                leftIcon="call-outline"
              />

              <Input
                label="University"
                value={profileData.university}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, university: text }))}
                editable={isEditing}
                leftIcon="school-outline"
              />

              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Input
                    label="Major"
                    value={profileData.major}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, major: text }))}
                    editable={isEditing}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Year"
                    value={profileData.year}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, year: text }))}
                    editable={isEditing}
                  />
                </View>
              </View>
            </View>

            {isEditing && (
              <View className="flex-row space-x-3 mt-6">
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={handleCancel}
                  className="flex-1"
                />
                <Button
                  title="Save Changes"
                  onPress={handleSave}
                  loading={loading}
                  className="flex-1"
                />
              </View>
            )}
          </Card>
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
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profilePicture: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileInfo: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  profileUniversity: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: (width - 80) / 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
