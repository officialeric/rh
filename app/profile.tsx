import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { UserStats } from '@/types/user';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const { user, updateProfile, getUserStats, isLoading, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    year: '',
  });
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        university: user.university || '',
        major: user.major || '',
        year: user.year || '',
      });
    }
  }, [user]);

  // Load user statistics
  useEffect(() => {
    const loadStats = async () => {
      if (user) {
        setStatsLoading(true);
        try {
          const userStats = await getUserStats();
          setStats(userStats);
        } catch (error) {
          console.error('Error loading stats:', error);
        } finally {
          setStatsLoading(false);
        }
      }
    };

    loadStats();
  }, [user, getUserStats]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const success = await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        university: profileData.university,
        major: profileData.major,
        year: profileData.year,
      });

      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes here if needed
  };

  const handleBack = () => {
    router.back();
  };

  const statsData = [
    {
      label: 'Total Reminders',
      value: stats?.totalReminders?.toString() || '0',
      icon: 'notifications-outline'
    },
    {
      label: 'Completed',
      value: stats?.completedReminders?.toString() || '0',
      icon: 'checkmark-circle-outline'
    },
    {
      label: 'Pending',
      value: stats?.pendingReminders?.toString() || '0',
      icon: 'time-outline'
    },
    {
      label: 'This Week',
      value: stats?.weeklyReminders?.toString() || '0',
      icon: 'calendar-outline'
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
              {statsLoading ? (
                <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  Loading statistics...
                </Text>
              ) : (
                statsData.map((stat, index) => (
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
                ))
              )}
            </View>
          </Card>

          {/* Personal Information */}
          <Card variant="elevated" style={styles.personalCard}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Personal Information
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  {/* First Name Input */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                      First Name
                    </Text>
                    <View style={[styles.inputWrapper, {
                      borderColor: isDark ? '#64748b' : '#d1d5db',
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      opacity: isEditing ? 1 : 0.6
                    }]}>
                      <TextInput
                        style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                        placeholder="First Name"
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        value={profileData.firstName}
                        onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
                        editable={isEditing}
                        selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                        blurOnSubmit={true}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.nameField}>
                  {/* Last Name Input */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                      Last Name
                    </Text>
                    <View style={[styles.inputWrapper, {
                      borderColor: isDark ? '#64748b' : '#d1d5db',
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      opacity: isEditing ? 1 : 0.6
                    }]}>
                      <TextInput
                        style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                        placeholder="Last Name"
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        value={profileData.lastName}
                        onChangeText={(text) => setProfileData(prev => ({ ...prev, lastName: text }))}
                        editable={isEditing}
                        selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                        blurOnSubmit={true}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                  Email
                </Text>
                <View style={[styles.inputWrapper, {
                  borderColor: isDark ? '#64748b' : '#d1d5db',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  opacity: isEditing ? 1 : 0.6
                }]}>
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="mail-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                    placeholder="Email"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={profileData.email}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    editable={isEditing}
                    selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                    blurOnSubmit={true}
                  />
                </View>
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                  Phone
                </Text>
                <View style={[styles.inputWrapper, {
                  borderColor: isDark ? '#64748b' : '#d1d5db',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  opacity: isEditing ? 1 : 0.6
                }]}>
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="call-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                    placeholder="Phone"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={profileData.phone}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
                    keyboardType="phone-pad"
                    editable={isEditing}
                    selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                    blurOnSubmit={true}
                  />
                </View>
              </View>

              {/* University Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                  University
                </Text>
                <View style={[styles.inputWrapper, {
                  borderColor: isDark ? '#64748b' : '#d1d5db',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  opacity: isEditing ? 1 : 0.6
                }]}>
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="school-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                    placeholder="University"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={profileData.university}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, university: text }))}
                    editable={isEditing}
                    selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                    blurOnSubmit={true}
                  />
                </View>
              </View>

              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  {/* Major Input */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                      Major
                    </Text>
                    <View style={[styles.inputWrapper, {
                      borderColor: isDark ? '#64748b' : '#d1d5db',
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      opacity: isEditing ? 1 : 0.6
                    }]}>
                      <TextInput
                        style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                        placeholder="Major"
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        value={profileData.major}
                        onChangeText={(text) => setProfileData(prev => ({ ...prev, major: text }))}
                        editable={isEditing}
                        selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                        blurOnSubmit={true}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.nameField}>
                  {/* Year Input */}
                  <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                      Year
                    </Text>
                    <View style={[styles.inputWrapper, {
                      borderColor: isDark ? '#64748b' : '#d1d5db',
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      opacity: isEditing ? 1 : 0.6
                    }]}>
                      <TextInput
                        style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                        placeholder="Year"
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        value={profileData.year}
                        onChangeText={(text) => setProfileData(prev => ({ ...prev, year: text }))}
                        editable={isEditing}
                        selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                        blurOnSubmit={true}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {isEditing && (
              <View style={styles.actionButtons}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={handleCancel}
                  style={styles.actionButton}
                />
                <Button
                  title="Save Changes"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.actionButton}
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
  personalCard: {
    paddingVertical: 24,
  },
  formContainer: {
    gap: 20,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    height: 56,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlignVertical: 'center',
    minHeight: 52,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
});
