import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
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
  TouchableOpacity,
  View
} from 'react-native';





export default function LoginScreen() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = () => {
    router.replace('/(tabs)');
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
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail"
            variant="outlined"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon="lock-closed"
            rightIcon={showPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            variant="outlined"
          />

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
