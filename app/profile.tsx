import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';

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
    <SafeAreaView className="flex-1 bg-secondary-50 dark:bg-secondary-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 bg-white dark:bg-secondary-800">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-secondary-900 dark:text-white">
              Profile
            </Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text className="text-primary-600 dark:text-primary-400 font-medium">
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 py-6">
          {/* Profile Picture & Basic Info */}
          <Card className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-primary-500 items-center justify-center mb-4">
              <Text className="text-3xl font-bold text-white">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </Text>
            </View>
            <Text className="text-xl font-bold text-secondary-900 dark:text-white">
              {profileData.firstName} {profileData.lastName}
            </Text>
            <Text className="text-secondary-600 dark:text-secondary-300">
              {profileData.major} • {profileData.year}
            </Text>
            <Text className="text-secondary-500 dark:text-secondary-400 text-sm">
              {profileData.university}
            </Text>
          </Card>

          {/* Stats */}
          <Card className="mb-6">
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Statistics
            </Text>
            <View className="flex-row flex-wrap">
              {stats.map((stat, index) => (
                <View key={stat.label} className="w-1/2 mb-4">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
                      <Ionicons 
                        name={stat.icon as any} 
                        size={16} 
                        color={isDark ? '#60a5fa' : '#3b82f6'} 
                      />
                    </View>
                    <View>
                      <Text className="text-2xl font-bold text-secondary-900 dark:text-white">
                        {stat.value}
                      </Text>
                      <Text className="text-sm text-secondary-600 dark:text-secondary-400">
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
