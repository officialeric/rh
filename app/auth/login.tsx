import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRequireGuest } from '@/hooks/useAuthGuard';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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





export default function LoginScreen() {
  const { isDark } = useTheme();
  const { login, isLoading, error, clearError } = useAuthContext();
  const { canAccess } = useRequireGuest();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Clear errors when component mounts or inputs change
  useEffect(() => {
    if (error) {
      clearError();
    }
    setValidationErrors([]);
  }, [email, password]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password.trim()) {
      errors.push('Password is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({ email: email.trim(), password });

      if (result.success) {
        router.replace('/(tabs)');
      }
      // Error handling is done in the auth store
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/auth/register');
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
        <View style={styles.header}>
          <View style={[
            styles.logoContainer,
            { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
          ]}>
            <Ionicons name="school" size={32} color="#0ea5e9" />
          </View>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
            Sign in to continue your learning journey
          </Text>
        </View>



        {/* Login Form */}
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
                <Ionicons name="mail" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
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

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
              Password
            </Text>
            <View style={[styles.inputWrapper, {
              borderColor: isDark ? '#64748b' : '#d1d5db',
              backgroundColor: isDark ? '#1e293b' : '#ffffff'
            }]}>
              <View style={styles.leftIconContainer}>
                <Ionicons name="lock-closed" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
              </View>
              <TextInput
                style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                blurOnSubmit={true}
              />
              <TouchableOpacity
                style={styles.rightIconContainer}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={isDark ? '#94a3b8' : '#64748b'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Display */}
          {(error || validationErrors.length > 0) && (
            <View style={styles.errorContainer}>
              {validationErrors.map((err, index) => (
                <Text key={index} style={styles.errorText}>
                  • {err}
                </Text>
              ))}
              {error && (
                <Text style={styles.errorText}>
                  • {error}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
            <Text style={[styles.forgotText, { color: '#0ea5e9' }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            variant="gradient"
            size="lg"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#475569' : '#e2e8f0' }]} />
            <Text style={[styles.dividerText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
              or
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#475569' : '#e2e8f0' }]} />
          </View>

          {/* Social Login */}
          <View style={styles.socialButtons}>
            <Button
              title="Continue with Google"
              variant="outline"
              size="lg"
              onPress={() => {}}
              leftIcon={<Ionicons name="logo-google" size={20} color="#0ea5e9" />}
              style={styles.socialButton}
            />
          </View>
        </Card>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={[styles.signupLink, { color: '#0ea5e9' }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
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
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
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
  rightIconContainer: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    borderColor: '#e2e8f0',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  signupText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signupLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
