import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const feedbackTypes = [
  { id: 'bug', name: 'Bug Report', icon: 'bug-outline', color: 'bg-red-500' },
  { id: 'feature', name: 'Feature Request', icon: 'bulb-outline', color: 'bg-yellow-500' },
  { id: 'improvement', name: 'Improvement', icon: 'trending-up-outline', color: 'bg-blue-500' },
  { id: 'general', name: 'General Feedback', icon: 'chatbubble-outline', color: 'bg-green-500' },
];

const getTypeColor = (typeId: string) => {
  switch (typeId) {
    case 'bug': return '#ef4444';
    case 'feature': return '#f59e0b';
    case 'improvement': return '#3b82f6';
    case 'general': return '#10b981';
    default: return '#6b7280';
  }
};

export default function FeedbackScreen() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    message: '',
    email: 'test@example.com', // Pre-filled from user profile
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.type) {
      Alert.alert('Error', 'Please select a feedback type');
      return;
    }
    if (!formData.subject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }
    if (!formData.message.trim()) {
      Alert.alert('Error', 'Please enter your feedback message');
      return;
    }

    setLoading(true);
    
    // Simulate sending feedback
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input and will review it carefully.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                type: '',
                subject: '',
                message: '',
                email: formData.email,
              });
              router.back();
            }
          }
        ]
      );
    }, 1500);
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
              Feedback
            </Text>
            <View style={styles.headerSpacer} />
          </View>
        </View>

        <View style={styles.content}>
          {/* Introduction */}
          <Card variant="elevated" style={styles.introCard}>
            <View style={styles.introContent}>
              <View style={[styles.introIcon, { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }]}>
                <Ionicons name="heart-outline" size={32} color="#0ea5e9" />
              </View>
              <Text style={[styles.introTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                We Value Your Feedback
              </Text>
              <Text style={[styles.introDescription, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                Help us improve Smart College Reminder by sharing your thoughts, reporting bugs, or suggesting new features.
              </Text>
            </View>
          </Card>

          {/* Feedback Type */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Feedback Type
            </Text>

            <View style={styles.typeGrid}>
              {feedbackTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setFormData(prev => ({ ...prev, type: type.id }))}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: formData.type === type.id
                        ? (isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)')
                        : (isDark ? '#1e293b' : '#ffffff'),
                      borderColor: formData.type === type.id
                        ? '#0ea5e9'
                        : (isDark ? '#334155' : '#e2e8f0'),
                    }
                  ]}
                >
                  <View style={[styles.typeIcon, { backgroundColor: getTypeColor(type.id) }]}>
                    <Ionicons name={type.icon as any} size={20} color="white" />
                  </View>
                  <Text style={[
                    styles.typeText,
                    {
                      color: formData.type === type.id
                        ? '#0ea5e9'
                        : (isDark ? '#cbd5e1' : '#475569'),
                    }
                  ]}>
                    {type.name}
                  </Text>
                  {formData.type === type.id && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark-circle" size={24} color="#0ea5e9" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Feedback Details */}
          <Card variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Details
            </Text>

            {/* Subject Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                Subject
              </Text>
              <View style={[styles.inputWrapper, {
                borderColor: isDark ? '#64748b' : '#d1d5db',
                backgroundColor: isDark ? '#1e293b' : '#ffffff'
              }]}>
                <TextInput
                  style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                  placeholder="Brief description of your feedback"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={formData.subject}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                Message
              </Text>
              <View style={[styles.inputWrapper, styles.multilineWrapper, {
                borderColor: isDark ? '#64748b' : '#d1d5db',
                backgroundColor: isDark ? '#1e293b' : '#ffffff'
              }]}>
                <TextInput
                  style={[styles.textInput, styles.multilineInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                  placeholder="Please provide detailed feedback..."
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={formData.message}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                  multiline={true}
                  numberOfLines={6}
                  textAlignVertical="top"
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                Email (Optional)
              </Text>
              <View style={[styles.inputWrapper, {
                borderColor: isDark ? '#64748b' : '#d1d5db',
                backgroundColor: isDark ? '#1e293b' : '#ffffff'
              }]}>
                <View style={styles.leftIconContainer}>
                  <Ionicons name="mail-outline" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                </View>
                <TextInput
                  style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                  placeholder="Your email for follow-up"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>
          </Card>

          {/* Submit Button */}
          <Button
            title="Submit Feedback"
            onPress={handleSubmit}
            loading={loading}
            variant="gradient"
            size="lg"
            style={styles.submitButton}
            leftIcon={<Ionicons name="send" size={20} color="white" />}
          />

          {/* Contact Info */}
          <Card variant="elevated" style={styles.contactCard}>
            <Text style={[styles.contactTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Other Ways to Reach Us
            </Text>
            <View style={styles.contactList}>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                <Text style={[styles.contactText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  support@smartcollegereminder.com
                </Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="globe-outline" size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                <Text style={[styles.contactText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  www.smartcollegereminder.com/support
                </Text>
              </View>
            </View>
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
  introCard: {
    paddingVertical: 32,
  },
  introContent: {
    alignItems: 'center',
  },
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: '500',
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
  typeGrid: {
    gap: 12,
  },
  typeCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  inputContainer: {
    marginBottom: 16,
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
    minHeight: 120,
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
    minHeight: 116,
  },
  submitButton: {
    width: '100%',
  },
  contactCard: {
    paddingVertical: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactList: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});
