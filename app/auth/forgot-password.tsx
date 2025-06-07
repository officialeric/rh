import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-secondary-900">
        <View className="flex-1 px-6 py-8 justify-center">
          <View className="items-center">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-6 bg-success-50 dark:bg-success-900">
              <Ionicons name="checkmark-circle-outline" size={40} color="#22c55e" />
            </View>
            <Text className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
              Check Your Email
            </Text>
            <Text className="text-center text-secondary-600 dark:text-secondary-300 mb-8">
              We've sent a password reset link to {email}
            </Text>
            <Button
              title="Back to Login"
              onPress={handleBackToLogin}
              className="w-full"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-secondary-900">
      <View className="flex-1 px-6 py-8">
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full items-center justify-center mb-4 bg-warning-50 dark:bg-warning-900">
            <Ionicons name="key-outline" size={40} color="#f59e0b" />
          </View>
          <Text className="text-2xl font-bold text-secondary-900 dark:text-white">
            Forgot Password?
          </Text>
          <Text className="text-secondary-600 dark:text-secondary-300 mt-2 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        <View>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Button
            title="Send Reset Link"
            onPress={handleResetPassword}
            loading={loading}
            className="w-full mt-6"
          />

          <Button
            title="Back to Login"
            variant="ghost"
            onPress={handleBackToLogin}
            className="w-full mt-4"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
