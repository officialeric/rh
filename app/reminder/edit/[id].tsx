import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  { id: 'assignment', name: 'Assignment', icon: 'document-text-outline', color: 'bg-blue-500' },
  { id: 'exam', name: 'Exam', icon: 'school-outline', color: 'bg-red-500' },
  { id: 'meeting', name: 'Meeting', icon: 'people-outline', color: 'bg-green-500' },
  { id: 'personal', name: 'Personal', icon: 'person-outline', color: 'bg-purple-500' },
];

const priorities = [
  { id: 'low', name: 'Low', color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' },
  { id: 'high', name: 'High', color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' },
];

// Mock data - in real app, this would be fetched based on ID
const mockReminderData = {
  title: 'Math Assignment Due',
  description: 'Complete calculus homework problems 1-20. Focus on integration by parts and substitution methods.',
  category: 'assignment',
  priority: 'high',
  dueDate: '2024-01-15',
  dueTime: '10:00',
  notes: 'Remember to show all work and include graphs for visualization problems.',
};

export default function EditReminderScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState(mockReminderData);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your reminder');
      return;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Reminder updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    }, 1000);
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

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
              Edit Reminder
            </Text>
            <View className="w-6" />
          </View>
        </View>

        <View className="px-6 py-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Basic Information
            </Text>
            
            <Input
              label="Title"
              placeholder="Enter reminder title"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            />

            <Input
              label="Description (Optional)"
              placeholder="Add more details..."
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
          </Card>

          {/* Category Selection */}
          <Card>
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Category
            </Text>
            
            <View className="flex-row flex-wrap gap-3">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  className={`flex-1 min-w-[45%] p-4 rounded-xl border-2 ${
                    formData.category === category.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700'
                  }`}
                >
                  <View className="items-center">
                    <View className={`w-12 h-12 rounded-full ${category.color} items-center justify-center mb-2`}>
                      <Ionicons name={category.icon as any} size={24} color="white" />
                    </View>
                    <Text className={`font-medium ${
                      formData.category === category.id
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-secondary-700 dark:text-secondary-300'
                    }`}>
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Priority Selection */}
          <Card>
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Priority
            </Text>
            
            <View className="flex-row space-x-3">
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  onPress={() => setFormData(prev => ({ ...prev, priority: priority.id }))}
                  className={`flex-1 p-3 rounded-lg border-2 ${
                    formData.priority === priority.id
                      ? 'border-primary-500'
                      : 'border-secondary-300 dark:border-secondary-600'
                  }`}
                >
                  <View className="items-center">
                    <View className={`px-3 py-1 rounded-full ${priority.color}`}>
                      <Text className={`text-sm font-medium ${priority.color.split(' ').slice(-2).join(' ')}`}>
                        {priority.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Date & Time */}
          <Card>
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Due Date & Time
            </Text>
            
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Input
                  label="Date"
                  placeholder="Select date"
                  value={formData.dueDate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
                  rightIcon="calendar-outline"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Time"
                  placeholder="Select time"
                  value={formData.dueTime}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, dueTime: text }))}
                  rightIcon="time-outline"
                />
              </View>
            </View>
          </Card>

          {/* Additional Notes */}
          <Card>
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Additional Notes
            </Text>
            
            <Input
              placeholder="Add any additional notes or details..."
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={4}
            />
          </Card>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 pt-4">
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
