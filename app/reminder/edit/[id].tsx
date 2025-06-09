import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
                  onPress={() => setFormData(prev => ({ ...prev, priority: priority.id }))}
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
                <Input
                  label="Date"
                  placeholder="Select date"
                  value={formData.dueDate}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
                  rightIcon="calendar-outline"
                />
              </View>
              <View style={styles.dateTimeField}>
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
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
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
});
