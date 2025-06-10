import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.successContainer}>
          <Card variant="elevated" style={styles.successCard}>
            <View style={styles.successContent}>
              <View style={[
                styles.successIcon,
                { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)' }
              ]}>
                <Ionicons name="checkmark-circle-outline" size={48} color="#22c55e" />
              </View>
              <Text style={[styles.successTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                Check Your Email
              </Text>
              <Text style={[styles.successDescription, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
              </Text>
              <Button
                title="Back to Login"
                variant="gradient"
                size="lg"
                onPress={handleBackToLogin}
                style={styles.backButton}
              />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin} style={styles.backButtonHeader}>
              <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
            </TouchableOpacity>
            <View style={[
              styles.logoContainer,
              { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)' }
            ]}>
              <Ionicons name="key-outline" size={32} color="#f59e0b" />
            </View>
            <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Forgot Password?
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
          </View>

          {/* Form */}
          <Card variant="elevated" style={styles.formCard}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                Email Address
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
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>

            <Button
              title="Send Reset Link"
              variant="gradient"
              size="lg"
              onPress={handleResetPassword}
              loading={loading}
              style={styles.resetButton}
            />

            <Button
              title="Back to Login"
              variant="outline"
              size="lg"
              onPress={handleBackToLogin}
              style={styles.loginButton}
            />
          </Card>
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    position: 'relative',
  },
  backButtonHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  formCard: {
    marginBottom: 24,
    paddingVertical: 32,
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
  resetButton: {
    marginBottom: 16,
  },
  loginButton: {
    borderColor: '#e2e8f0',
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 32,
  },
  successCard: {
    paddingVertical: 40,
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  backButton: {
    width: '100%',
  },
});
