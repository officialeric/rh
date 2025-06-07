import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

// Mock reminder data - in real app, this would come from API/database
const mockReminder = {
  id: 1,
  title: 'Math Assignment Due',
  description: 'Complete calculus homework problems 1-20. Focus on integration by parts and substitution methods. Review chapter 8 examples before starting.',
  category: 'assignment',
  priority: 'high',
  dueDate: '2024-01-15T10:00:00Z',
  createdAt: '2024-01-10T09:00:00Z',
  completed: false,
  notes: 'Remember to show all work and include graphs for visualization problems.',
};

const categoryInfo = {
  assignment: { name: 'Assignment', icon: 'document-text-outline', color: 'bg-blue-500' },
  exam: { name: 'Exam', icon: 'school-outline', color: 'bg-red-500' },
  meeting: { name: 'Meeting', icon: 'people-outline', color: 'bg-green-500' },
  personal: { name: 'Personal', icon: 'person-outline', color: 'bg-purple-500' },
};

const priorityColors = {
  high: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-500',
  medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-500',
  low: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-500',
};

export default function ViewReminderScreen() {
  const { isDark } = useTheme();
  const { id } = useLocalSearchParams();
  const [reminder, setReminder] = useState(mockReminder);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeUntil = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `Due in ${diffDays} days`;
    return `Due in ${Math.ceil(diffDays / 7)} weeks`;
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/reminder/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Simulate deletion
            Alert.alert('Deleted', 'Reminder has been deleted successfully.', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          }
        }
      ]
    );
  };

  const handleToggleComplete = () => {
    setReminder(prev => ({ ...prev, completed: !prev.completed }));
    Alert.alert(
      'Success',
      reminder.completed ? 'Reminder marked as incomplete' : 'Reminder marked as complete!'
    );
  };

  const categoryData = categoryInfo[reminder.category as keyof typeof categoryInfo];
  const priorityData = priorityColors[reminder.priority as keyof typeof priorityColors];

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
              Reminder Details
            </Text>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 py-6">
          {/* Main Info */}
          <Card className="mb-6">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <View className="flex-row items-center mb-3">
                  <View className={`w-10 h-10 rounded-full ${categoryData.color} items-center justify-center mr-3`}>
                    <Ionicons name={categoryData.icon as any} size={20} color="white" />
                  </View>
                  <View>
                    <Text className="text-sm text-secondary-500 dark:text-secondary-400 capitalize">
                      {categoryData.name}
                    </Text>
                    <View className={`px-2 py-1 rounded-full border ${priorityData}`}>
                      <Text className={`text-xs font-medium ${priorityData.split(' ').slice(2, 4).join(' ')}`}>
                        {reminder.priority} priority
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                  {reminder.title}
                </Text>
                
                {reminder.description && (
                  <Text className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {reminder.description}
                  </Text>
                )}
              </View>
            </View>

            {/* Status */}
            <View className={`p-3 rounded-lg ${
              reminder.completed 
                ? 'bg-green-100 dark:bg-green-900' 
                : 'bg-orange-100 dark:bg-orange-900'
            }`}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons 
                    name={reminder.completed ? "checkmark-circle" : "time-outline"} 
                    size={20} 
                    color={reminder.completed ? "#22c55e" : "#f59e0b"} 
                  />
                  <Text className={`ml-2 font-medium ${
                    reminder.completed 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-orange-700 dark:text-orange-300'
                  }`}>
                    {reminder.completed ? 'Completed' : formatTimeUntil(reminder.dueDate)}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleToggleComplete}>
                  <Text className="text-primary-600 dark:text-primary-400 font-medium">
                    Mark as {reminder.completed ? 'Incomplete' : 'Complete'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Due Date & Time */}
          <Card className="mb-6">
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
              Due Date & Time
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text className="text-secondary-700 dark:text-secondary-300 ml-3">
                {formatDate(reminder.dueDate)}
              </Text>
            </View>
          </Card>

          {/* Additional Notes */}
          {reminder.notes && (
            <Card className="mb-6">
              <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
                Notes
              </Text>
              <Text className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                {reminder.notes}
              </Text>
            </Card>
          )}

          {/* Created Date */}
          <Card className="mb-6">
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-3">
              Created
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text className="text-secondary-700 dark:text-secondary-300 ml-3">
                {formatDate(reminder.createdAt)}
              </Text>
            </View>
          </Card>

          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              title="Edit Reminder"
              onPress={handleEdit}
              leftIcon={<Ionicons name="create-outline" size={20} color="white" />}
              className="w-full"
            />
            
            <Button
              title="Delete Reminder"
              variant="outline"
              onPress={handleDelete}
              leftIcon={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
              className="w-full border-error-500"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
