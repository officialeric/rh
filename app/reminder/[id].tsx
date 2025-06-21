import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useReminders } from '@/contexts/ReminderContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { Reminder } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Category mapping for display purposes
const categoryInfo = {
  assignment: { name: 'Assignment', icon: 'document-text-outline', color: '#3b82f6' },
  exam: { name: 'Exam', icon: 'school-outline', color: '#ef4444' },
  meeting: { name: 'Meeting', icon: 'people-outline', color: '#10b981' },
  personal: { name: 'Personal', icon: 'person-outline', color: '#8b5cf6' },
};



const priorityColors = {
  high: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-500',
  medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-500',
  low: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-500',
};

export default function ViewReminderScreen() {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { reminders, deleteReminder, markAsCompleted, markAsPending } = useReminders();
  const { id } = useLocalSearchParams();

  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch reminder data on component mount
  useEffect(() => {
    if (!id || !user) {
      setIsLoading(false);
      return;
    }

    // Find the reminder from the reminders array
    const foundReminder = reminders.find(r => r.id === parseInt(id as string));

    if (foundReminder) {
      setReminder(foundReminder);
    } else {
      Alert.alert('Error', 'Reminder not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }

    setIsLoading(false);
  }, [id, user, reminders]);

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
    if (!reminder) return;

    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);

            try {
              const success = await deleteReminder(reminder.id);

              if (success) {
                Alert.alert('Deleted', 'Reminder has been deleted successfully.', [
                  { text: 'OK', onPress: () => router.back() }
                ]);
              } else {
                Alert.alert('Error', 'Failed to delete reminder');
                setIsDeleting(false);
              }
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', 'Failed to delete reminder');
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const handleToggleComplete = async () => {
    if (!reminder || !user) return;

    setIsUpdating(true);

    try {
      const success = reminder.isCompleted
        ? await markAsPending(reminder.id)
        : await markAsCompleted(reminder.id);

      if (success) {
        // Update local state
        setReminder(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
        Alert.alert(
          'Success',
          reminder.isCompleted ? 'Reminder marked as incomplete' : 'Reminder marked as complete!'
        );
      } else {
        Alert.alert('Error', 'Failed to update reminder status');
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      Alert.alert('Error', 'Failed to update reminder status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
          <Text style={[styles.loadingText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Loading reminder...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error if no reminder found
  if (!reminder) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Reminder not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Since our database doesn't have category field, we'll derive it from title
  const getCategory = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('assignment') || lowerTitle.includes('homework')) return 'assignment';
    if (lowerTitle.includes('exam') || lowerTitle.includes('test')) return 'exam';
    if (lowerTitle.includes('meeting')) return 'meeting';
    return 'personal';
  };

  const category = getCategory(reminder.title);
  const categoryData = categoryInfo[category as keyof typeof categoryInfo];
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
              backgroundColor: reminder.isCompleted
                ? (isDark ? 'rgba(34, 197, 94, 0.2)' : '#f0fdf4')
                : (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fffbeb')
            }]}>
              <View style={styles.statusRow}>
                <View style={styles.statusLeft}>
                  <Ionicons
                    name={reminder.isCompleted ? "checkmark-circle" : "time-outline"}
                    size={20}
                    color={reminder.isCompleted ? "#22c55e" : "#f59e0b"}
                  />
                  <Text style={[styles.statusText, {
                    color: reminder.isCompleted
                      ? (isDark ? '#86efac' : '#15803d')
                      : (isDark ? '#fbbf24' : '#d97706')
                  }]}>
                    {reminder.isCompleted ? 'Completed' : formatTimeUntil(reminder.dueDate)}
                  </Text>
                </View>
                <TouchableOpacity onPress={handleToggleComplete} disabled={isUpdating}>
                  <Text style={[styles.toggleText, {
                    color: isUpdating ? '#94a3b8' : '#0ea5e9'
                  }]}>
                    {isUpdating ? 'Updating...' : `Mark as ${reminder.isCompleted ? 'Incomplete' : 'Complete'}`}
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

          {/* Description */}
          {reminder.description && (
            <Card variant="elevated" style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                Description
              </Text>
              <Text style={[styles.notesText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                {reminder.description}
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
              disabled={isDeleting || isUpdating}
            />

            <Button
              title={isDeleting ? "Deleting..." : "Delete Reminder"}
              variant="outline"
              onPress={handleDelete}
              leftIcon={!isDeleting ? <Ionicons name="trash-outline" size={20} color="#ef4444" /> : undefined}
              style={styles.actionButton}
              disabled={isDeleting || isUpdating}
              loading={isDeleting}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
