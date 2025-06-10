import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const { currentUser, isLoading, error, logout, clearError } = useAuthContext();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileStats, setProfileStats] = useState<any>(null);

  // Profile management functions
  const refreshProfileStats = async () => {
    if (!currentUser) return;
    try {
      const { getUserProfileStats } = await import('@/lib/profile');
      const stats = await getUserProfileStats(currentUser.id);
      setProfileStats(stats);
    } catch (error) {
      console.error('Error refreshing profile stats:', error);
    }
  };

  const updateProfile = async (data: any) => {
    if (!currentUser) return { success: false, error: 'User not authenticated' };
    try {
      const { updateUserProfile } = await import('@/lib/profile');
      return await updateUserProfile(currentUser.id, data);
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const changePassword = async (data: any) => {
    if (!currentUser) return { success: false, error: 'User not authenticated' };
    try {
      const { changeUserPassword } = await import('@/lib/profile');
      return await changeUserPassword(currentUser.id, data);
    } catch (error) {
      return { success: false, error: 'Failed to change password' };
    }
  };

  // Initialize profile data from current user
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  // Load profile stats on mount
  useEffect(() => {
    if (currentUser) {
      refreshProfileStats();
    }
  }, [currentUser, refreshProfileStats]);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors([]);
  }, [profileData, passwordData]);

  const handleSave = async () => {
    setLoading(true);
    setValidationErrors([]);

    try {
      const result = await updateProfile(profileData);

      if (result.success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        setValidationErrors([result.error || 'Failed to update profile']);
      }
    } catch (error) {
      setValidationErrors(['An unexpected error occurred']);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValidationErrors([]);
    // Reset profile data to current user data
    if (currentUser) {
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || '',
      });
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setValidationErrors([]);

    try {
      const result = await changePassword(passwordData);

      if (result.success) {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        Alert.alert('Success', 'Password changed successfully!');
      } else {
        setValidationErrors([result.error || 'Failed to change password']);
      }
    } catch (error) {
      setValidationErrors(['An unexpected error occurred']);
    } finally {
      setLoading(false);
    }
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
          onPress: () => {
            logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const getProfileCompletion = () => {
    if (!currentUser) return 0;
    try {
      // Simple calculation without import to avoid issues
      let score = 0;
      const fields = [
        currentUser.firstName,
        currentUser.lastName,
        currentUser.email,
        currentUser.phone,
        currentUser.bio,
        currentUser.profilePicture
      ];

      fields.forEach(field => {
        if (field && field.trim()) {
          score += Math.round(100 / fields.length);
        }
      });

      return Math.min(score, 100);
    } catch (error) {
      return 0;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stats = [
    {
      label: 'Total Reminders',
      value: profileStats?.totalReminders?.toString() || '0',
      icon: 'notifications-outline'
    },
    {
      label: 'Completed',
      value: profileStats?.completedReminders?.toString() || '0',
      icon: 'checkmark-circle-outline'
    },
    {
      label: 'Pending',
      value: profileStats?.pendingReminders?.toString() || '0',
      icon: 'time-outline'
    },
    {
      label: 'Completion Rate',
      value: `${profileStats?.completionRate || 0}%`,
      icon: 'trending-up-outline'
    },
  ];

  // Don't render if user is not authenticated
  if (!currentUser) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
                {currentUser.firstName?.[0] || ''}{currentUser.lastName?.[0] || ''}
              </Text>
            </View>
            <Text style={[styles.profileName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text style={[styles.profileEmail, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              {currentUser.email}
            </Text>

            {/* Profile Completion */}
            <View style={styles.completionContainer}>
              <View style={styles.completionHeader}>
                <Text style={[styles.completionLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  Profile Completion
                </Text>
                <Text style={[styles.completionPercentage, { color: '#0ea5e9' }]}>
                  {getProfileCompletion()}%
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProfileCompletion()}%`,
                      backgroundColor: '#0ea5e9'
                    }
                  ]}
                />
              </View>
            </View>

            {/* Account Info */}
            <View style={styles.accountInfo}>
              <Text style={[styles.accountLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                Member since {formatDate(currentUser.createdAt)}
              </Text>
              {currentUser.lastLoginAt && (
                <Text style={[styles.accountLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  Last login: {formatDate(currentUser.lastLoginAt)}
                </Text>
              )}
            </View>
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
          <Card variant="elevated" style={styles.personalCard}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                Personal Information
              </Text>
              {!isEditing && (
                <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editIconButton}>
                  <Ionicons name="pencil" size={20} color="#0ea5e9" />
                </TouchableOpacity>
              )}
            </View>

            {/* Error Messages */}
            {(validationErrors.length > 0 || error) && (
              <View style={styles.errorContainer}>
                {validationErrors.map((err, index) => (
                  <Text key={index} style={styles.errorText}>{err}</Text>
                ))}
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>
            )}

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

              {/* Bio Input */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                  Bio
                </Text>
                <View style={[styles.inputWrapper, styles.bioWrapper, {
                  borderColor: isDark ? '#64748b' : '#d1d5db',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  opacity: isEditing ? 1 : 0.6
                }]}>
                  <TextInput
                    style={[styles.textInput, styles.bioInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                    placeholder="Tell us about yourself..."
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={profileData.bio}
                    onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
                    editable={isEditing}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                    blurOnSubmit={true}
                  />
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

            {!isEditing && (
              <View style={styles.actionButtons}>
                <Button
                  title="Change Password"
                  variant="outline"
                  onPress={() => setShowPasswordModal(true)}
                  style={styles.actionButton}
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#0ea5e9" />}
                />
                <Button
                  title="Logout"
                  variant="outline"
                  onPress={handleLogout}
                  style={[styles.actionButton, styles.logoutButton]}
                  leftIcon={<Ionicons name="log-out-outline" size={20} color="#ef4444" />}
                />
              </View>
            )}
          </Card>
        </View>
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#ffffff' : '#0f172a'} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Change Password
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Card variant="elevated" style={styles.passwordCard}>
              {/* Error Messages */}
              {validationErrors.length > 0 && (
                <View style={styles.errorContainer}>
                  {validationErrors.map((err, index) => (
                    <Text key={index} style={styles.errorText}>{err}</Text>
                  ))}
                </View>
              )}

              {/* Current Password */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                  Current Password
                </Text>
                <View style={[styles.inputWrapper, {
                  borderColor: isDark ? '#64748b' : '#d1d5db',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff'
                }]}>
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                    placeholder="Enter current password"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={passwordData.currentPassword}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                    secureTextEntry={true}
                    selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  />
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                  New Password
                </Text>
                <View style={[styles.inputWrapper, {
                  borderColor: isDark ? '#64748b' : '#d1d5db',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff'
                }]}>
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="key-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                    placeholder="Enter new password"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={passwordData.newPassword}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                    secureTextEntry={true}
                    selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  />
                </View>
              </View>

              {/* Confirm New Password */}
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                  Confirm New Password
                </Text>
                <View style={[styles.inputWrapper, {
                  borderColor: isDark ? '#64748b' : '#d1d5db',
                  backgroundColor: isDark ? '#1e293b' : '#ffffff'
                }]}>
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="checkmark-circle-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
                  <TextInput
                    style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                    placeholder="Confirm new password"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                    value={passwordData.confirmPassword}
                    onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                    secureTextEntry={true}
                    selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setShowPasswordModal(false)}
                  style={styles.modalActionButton}
                />
                <Button
                  title="Change Password"
                  onPress={handlePasswordChange}
                  loading={loading}
                  style={styles.modalActionButton}
                />
              </View>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  profileEmail: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  completionContainer: {
    width: '100%',
    marginBottom: 16,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  completionPercentage: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  accountInfo: {
    alignItems: 'center',
    gap: 4,
  },
  accountLabel: {
    fontSize: 12,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editIconButton: {
    padding: 8,
    borderRadius: 20,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  bioWrapper: {
    height: 120,
    alignItems: 'flex-start',
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  logoutButton: {
    borderColor: '#ef4444',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  passwordCard: {
    paddingVertical: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalActionButton: {
    flex: 1,
  },
});
