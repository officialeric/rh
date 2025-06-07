import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';

const feedbackTypes = [
  { id: 'bug', name: 'Bug Report', icon: 'bug-outline', color: 'bg-red-500' },
  { id: 'feature', name: 'Feature Request', icon: 'bulb-outline', color: 'bg-yellow-500' },
  { id: 'improvement', name: 'Improvement', icon: 'trending-up-outline', color: 'bg-blue-500' },
  { id: 'general', name: 'General Feedback', icon: 'chatbubble-outline', color: 'bg-green-500' },
];

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
    <SafeAreaView className="flex-1 bg-secondary-50 dark:bg-secondary-900">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 bg-white dark:bg-secondary-800">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-secondary-900 dark:text-white">
              Feedback
            </Text>
            <View className="w-6" />
          </View>
        </View>

        <View className="px-6 py-6">
          {/* Introduction */}
          <Card className="mb-6">
            <View className="items-center">
              <View className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mb-4">
                <Ionicons name="heart-outline" size={32} color={isDark ? '#60a5fa' : '#3b82f6'} />
              </View>
              <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                We Value Your Feedback
              </Text>
              <Text className="text-center text-secondary-600 dark:text-secondary-300">
                Help us improve Smart College Reminder by sharing your thoughts, reporting bugs, or suggesting new features.
              </Text>
            </View>
          </Card>

          {/* Feedback Type */}
          <Card className="mb-6">
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Feedback Type
            </Text>
            
            <View className="space-y-3">
              {feedbackTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setFormData(prev => ({ ...prev, type: type.id }))}
                  className={`p-4 rounded-xl border-2 flex-row items-center ${
                    formData.type === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-700'
                  }`}
                >
                  <View className={`w-10 h-10 rounded-full ${type.color} items-center justify-center mr-4`}>
                    <Ionicons name={type.icon as any} size={20} color="white" />
                  </View>
                  <Text className={`font-medium ${
                    formData.type === type.id
                      ? 'text-primary-700 dark:text-primary-300'
                      : 'text-secondary-700 dark:text-secondary-300'
                  }`}>
                    {type.name}
                  </Text>
                  {formData.type === type.id && (
                    <View className="ml-auto">
                      <Ionicons name="checkmark-circle" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Feedback Details */}
          <Card className="mb-6">
            <Text className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Details
            </Text>
            
            <Input
              label="Subject"
              placeholder="Brief description of your feedback"
              value={formData.subject}
              onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
            />

            <Input
              label="Message"
              placeholder="Please provide detailed feedback..."
              value={formData.message}
              onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
              multiline
              numberOfLines={6}
            />

            <Input
              label="Email (Optional)"
              placeholder="Your email for follow-up"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              leftIcon="mail-outline"
            />
          </Card>

          {/* Submit Button */}
          <Button
            title="Submit Feedback"
            onPress={handleSubmit}
            loading={loading}
            className="w-full"
            leftIcon={<Ionicons name="send" size={20} color="white" />}
          />

          {/* Contact Info */}
          <Card className="mt-6">
            <Text className="text-base font-medium text-secondary-900 dark:text-white mb-2">
              Other Ways to Reach Us
            </Text>
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                <Text className="text-sm text-secondary-600 dark:text-secondary-400 ml-2">
                  support@smartcollegereminder.com
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="globe-outline" size={16} color={isDark ? '#94a3b8' : '#64748b'} />
                <Text className="text-sm text-secondary-600 dark:text-secondary-400 ml-2">
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
