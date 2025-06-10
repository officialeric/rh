import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'assignment', name: 'Assignment', icon: 'document-text', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  { id: 'exam', name: 'Exam', icon: 'school', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  { id: 'meeting', name: 'Meeting', icon: 'people', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { id: 'personal', name: 'Personal', icon: 'person', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
];

const priorities = [
  { id: 'low', name: 'Low', color: '#16a34a', bgColor: 'rgba(22, 163, 74, 0.1)' },
  { id: 'medium', name: 'Medium', color: '#d97706', bgColor: 'rgba(217, 119, 6, 0.1)' },
  { id: 'high', name: 'High', color: '#dc2626', bgColor: 'rgba(220, 38, 38, 0.1)' },
];

export default function NewReminderScreen() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    dueTime: '',
  });
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
        'Reminder created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'medium',
                dueDate: '',
                dueTime: '',
              });
              router.push('/(tabs)');
            }
          }
        ]
      );
    }, 1000);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <View style={[
            styles.header,
            { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)' }
          ]}>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                New Reminder
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
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="document-text" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
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
                  <View style={styles.leftIconContainer}>
                    <Ionicons name="text" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                  </View>
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
                      <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                        <Ionicons name={category.icon as any} size={24} color={category.color} />
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
                      <View style={[styles.priorityBadge, { backgroundColor: priority.bgColor }]}>
                        <Text style={[styles.priorityText, { color: priority.color }]}>
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
                        <Ionicons name="calendar" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
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
                        <Ionicons name="time" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
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
                size="lg"
                onPress={handleCancel}
                style={styles.cancelButton}
              />
              <Button
                title="Save Reminder"
                variant="gradient"
                size="lg"
                onPress={handleSave}
                loading={loading}
                style={styles.saveButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 12,
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
    padding: 16,
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
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
