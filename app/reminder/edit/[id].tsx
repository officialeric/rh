import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useReminders } from '@/contexts/ReminderContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { Reminder } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
const { width } = Dimensions.get('window');

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



export default function EditReminderScreen() {
  const { isDark } = useTheme();
  const { user } = useUser();
  const { reminders, updateReminder } = useReminders();
  const { id } = useLocalSearchParams();

  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    dueTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

      // Parse the dueDate to extract date and time
      const dueDateTime = new Date(foundReminder.dueDate);
      const dateStr = dueDateTime.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = dueDateTime.toTimeString().split(' ')[0].slice(0, 5); // HH:MM

      // Since our database doesn't have category field, we'll derive it from title
      const getCategory = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('assignment') || lowerTitle.includes('homework')) return 'assignment';
        if (lowerTitle.includes('exam') || lowerTitle.includes('test')) return 'exam';
        if (lowerTitle.includes('meeting')) return 'meeting';
        return 'personal';
      };

      setFormData({
        title: foundReminder.title,
        description: foundReminder.description || '',
        category: getCategory(foundReminder.title),
        priority: foundReminder.priority,
        dueDate: dateStr,
        dueTime: timeStr,
      });
    } else {
      Alert.alert('Error', 'Reminder not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }

    setIsLoading(false);
  }, [id, user, reminders]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your reminder');
      return;
    }
    if (!formData.dueDate) {
      Alert.alert('Error', 'Please select a due date');
      return;
    }
    if (!reminder) {
      Alert.alert('Error', 'Reminder not found');
      return;
    }

    setLoading(true);

    try {
      // Combine date and time into a single datetime string
      const dueDateTime = formData.dueTime
        ? `${formData.dueDate}T${formData.dueTime}:00.000Z`
        : `${formData.dueDate}T23:59:59.000Z`;

      const success = await updateReminder(reminder.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        dueDate: dueDateTime,
      });

      if (success) {
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
      } else {
        Alert.alert('Error', 'Failed to update reminder');
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
      Alert.alert('Error', 'Failed to update reminder');
    } finally {
      setLoading(false);
    }
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

  // Show loading screen while fetching reminder data
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
              Edit Reminder
            </Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <View style={styles.content}>
          {/* Basic Information */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Basic Information
            </Text>
            
            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                Title
              </Text>
              <View style={[styles.inputWrapper, {
                borderColor: isDark ? '#64748b' : '#d1d5db',
                backgroundColor: isDark ? '#1e293b' : '#ffffff'
              }]}>
                <TextInput
                  style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                  placeholder="Enter reminder title"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={formData.title}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                Description (Optional)
              </Text>
              <View style={[styles.inputWrapper, styles.multilineWrapper, {
                borderColor: isDark ? '#64748b' : '#d1d5db',
                backgroundColor: isDark ? '#1e293b' : '#ffffff'
              }]}>
                <TextInput
                  style={[styles.textInput, styles.multilineInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                  placeholder="Add more details..."
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={formData.description}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>
          </Card>

          {/* Category Selection */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Category
            </Text>

            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setFormData(prev => ({ ...prev, category: category.id }))}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: formData.category === category.id
                        ? (isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)')
                        : (isDark ? '#1e293b' : '#ffffff'),
                      borderColor: formData.category === category.id
                        ? '#0ea5e9'
                        : (isDark ? '#334155' : '#e2e8f0'),
                    }
                  ]}
                >
                  <View style={styles.categoryContent}>
                    <View style={[styles.categoryIcon, { backgroundColor: '#3b82f6' }]}>
                      <Ionicons name={category.icon as any} size={24} color="white" />
                    </View>
                    <Text style={[
                      styles.categoryText,
                      {
                        color: formData.category === category.id
                          ? '#0ea5e9'
                          : (isDark ? '#cbd5e1' : '#475569'),
                      }
                    ]}>
                      {category.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Priority Selection */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Priority
            </Text>

            <View style={styles.priorityGrid}>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority.id}
                  onPress={() => setFormData(prev => ({ ...prev, priority: priority.id as 'low' | 'medium' | 'high' }))}
                  style={[
                    styles.priorityCard,
                    {
                      backgroundColor: formData.priority === priority.id
                        ? (isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)')
                        : (isDark ? '#1e293b' : '#ffffff'),
                      borderColor: formData.priority === priority.id
                        ? '#0ea5e9'
                        : (isDark ? '#334155' : '#e2e8f0'),
                    }
                  ]}
                >
                  <View style={styles.priorityContent}>
                    <View style={[styles.priorityBadge, {
                      backgroundColor: priority.id === 'high' ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2') :
                                      priority.id === 'medium' ? (isDark ? 'rgba(245, 158, 11, 0.2)' : '#fffbeb') :
                                      (isDark ? 'rgba(34, 197, 94, 0.2)' : '#f0fdf4')
                    }]}>
                      <Text style={[styles.priorityText, {
                        color: priority.id === 'high' ? '#dc2626' :
                               priority.id === 'medium' ? '#d97706' : '#16a34a'
                      }]}>
                        {priority.name}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Date & Time */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Due Date & Time
            </Text>

            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeField}>
                {/* Date Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                    Date
                  </Text>
                  <View style={[styles.inputWrapper, {
                    borderColor: isDark ? '#64748b' : '#d1d5db',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff'
                  }]}>
                    <TextInput
                      style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                      placeholder="Select date"
                      placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                      value={formData.dueDate}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
                      selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                      blurOnSubmit={true}
                    />
                    <View style={styles.rightIconContainer}>
                      <Ionicons name="calendar-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.dateTimeField}>
                {/* Time Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                    Time
                  </Text>
                  <View style={[styles.inputWrapper, {
                    borderColor: isDark ? '#64748b' : '#d1d5db',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff'
                  }]}>
                    <TextInput
                      style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                      placeholder="Select time"
                      placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                      value={formData.dueTime}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, dueTime: text }))}
                      selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                      blurOnSubmit={true}
                    />
                    <View style={styles.rightIconContainer}>
                      <Ionicons name="time-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Card>



          {/* Action Buttons */}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.3,
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
  multilineWrapper: {
    height: 'auto',
    minHeight: 80,
    alignItems: 'flex-start',
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
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 16,
    minHeight: 76,
  },
  rightIconContainer: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 72) / 2,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    minHeight: 110,
  },
  categoryContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  priorityContent: {
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeField: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
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
