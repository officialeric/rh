import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
              Reminder Details
            </Text>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Main Info */}
          <Card variant="elevated" style={styles.section}>
            <View style={styles.mainInfoContainer}>
              <View style={styles.mainInfoContent}>
                <View style={styles.categoryRow}>
                  <View style={[styles.categoryIcon, { backgroundColor: categoryData.color }]}>
                    <Ionicons name={categoryData.icon as any} size={20} color="white" />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={[styles.categoryName, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                      {categoryData.name}
                    </Text>
                    <View style={[styles.priorityBadge, {
                      backgroundColor: reminder.priority === 'high' ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2') :
                                      reminder.priority === 'medium' ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fffbeb') :
                                      (isDark ? 'rgba(34, 197, 94, 0.2)' : '#f0fdf4'),
                      borderColor: reminder.priority === 'high' ? '#ef4444' :
                                  reminder.priority === 'medium' ? '#f59e0b' : '#22c55e'
                    }]}>
                      <Text style={[styles.priorityText, {
                        color: reminder.priority === 'high' ? '#dc2626' :
                               reminder.priority === 'medium' ? '#d97706' : '#16a34a'
                      }]}>
                        {reminder.priority} priority
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={[styles.reminderTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                  {reminder.title}
                </Text>

                {reminder.description && (
                  <Text style={[styles.reminderDescription, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                    {reminder.description}
                  </Text>
                )}
              </View>
            </View>

            {/* Status */}
            <View style={[styles.statusContainer, {
              backgroundColor: reminder.completed
                ? (isDark ? 'rgba(34, 197, 94, 0.2)' : '#f0fdf4')
                : (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fffbeb')
            }]}>
              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <Ionicons
                    name={reminder.completed ? "checkmark-circle" : "time-outline"}
                    size={20}
                    color={reminder.completed ? "#22c55e" : "#f59e0b"}
                  />
                  <Text style={[styles.statusText, {
                    color: reminder.completed
                      ? (isDark ? '#86efac' : '#15803d')
                      : (isDark ? '#fbbf24' : '#d97706')
                  }]}>
                    {reminder.completed ? 'Completed' : formatTimeUntil(reminder.dueDate)}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleToggleComplete}>
                  <Text style={[styles.toggleText, { color: '#0ea5e9' }]}>
                    Mark as {reminder.completed ? 'Incomplete' : 'Complete'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          {/* Due Date & Time */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Due Date & Time
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text style={[styles.infoText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                {formatDate(reminder.dueDate)}
              </Text>
            </View>
          </Card>

          {/* Additional Notes */}
          {reminder.notes && (
            <Card variant="elevated" style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                Notes
              </Text>
              <Text style={[styles.notesText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                {reminder.notes}
              </Text>
            </Card>
          )}

          {/* Created Date */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Created
            </Text>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              <Text style={[styles.infoText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                {formatDate(reminder.createdAt)}
              </Text>
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Edit Reminder"
              onPress={handleEdit}
              leftIcon={<Ionicons name="create-outline" size={20} color="white" />}
              style={styles.actionButton}
            />

            <Button
              title="Delete Reminder"
              variant="outline"
              onPress={handleDelete}
              leftIcon={<Ionicons name="trash-outline" size={20} color="#ef4444" />}
              style={styles.actionButton}
            />
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
  editButton: {
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
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 24,
  },
  section: {
    paddingVertical: 24,
  },
  mainInfoContainer: {
    marginBottom: 16,
  },
  mainInfoContent: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  reminderTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  reminderDescription: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  statusContainer: {
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  actionButtons: {
    gap: 12,
    paddingTop: 8,
  },
  actionButton: {
    width: '100%',
  },
});
