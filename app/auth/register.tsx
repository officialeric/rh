import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const { isDark } = useTheme();
  const { register, isLoading, error, clearError } = useUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() ||
        !formData.email.trim() || !formData.password.trim()) {
      return;
    }

    const success = await register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (success) {
      router.replace("/(tabs)");
    }
  };

  const handleLogin = () => {
    router.push("/auth/login");
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
          <View style={styles.header}>
            <View style={[
              styles.logoContainer,
              { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.1)' }
            ]}>
              <Ionicons name="person-add" size={32} color="#0ea5e9" />
            </View>
            <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              Join Smart College Reminder and stay organized
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <Card variant="elevated" style={[styles.errorCard, { backgroundColor: isDark ? '#7f1d1d' : '#fef2f2' }]}>
              <View style={styles.errorContent}>
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text style={[styles.errorText, { color: '#dc2626' }]}>
                  {error}
                </Text>
                <TouchableOpacity onPress={clearError} style={styles.errorClose}>
                  <Ionicons name="close" size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </Card>
          )}

          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                {/* First Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                    First Name
                  </Text>
                  <View style={[styles.inputWrapper, {
                    borderColor: isDark ? '#64748b' : '#d1d5db',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff'
                  }]}>
                    <TextInput
                      style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                      placeholder="Enter first name"
                      placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                      value={formData.firstName}
                      onChangeText={(text) => setFormData(prev => ({...prev, firstName: text}))}
                      selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                      blurOnSubmit={true}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.nameField}>
                {/* Last Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                    Last Name
                  </Text>
                  <View style={[styles.inputWrapper, {
                    borderColor: isDark ? '#64748b' : '#d1d5db',
                    backgroundColor: isDark ? '#1e293b' : '#ffffff'
                  }]}>
                    <TextInput
                      style={[styles.textInput, { color: isDark ? '#ffffff' : '#1e293b' }]}
                      placeholder="Enter last name"
                      placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                      value={formData.lastName}
                      onChangeText={(text) => setFormData(prev => ({...prev, lastName: text}))}
                      selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                      blurOnSubmit={true}
                    />
                  </View>
                </View>
              </View>
            </View>

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
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
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
                  placeholder="Create password"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({...prev, password: text}))}
                  secureTextEntry={true}
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? '#ffffff' : '#374151' }]}>
                Confirm Password
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
                  placeholder="Confirm password"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData(prev => ({...prev, confirmPassword: text}))}
                  secureTextEntry={true}
                  selectionColor={isDark ? '#38bdf8' : '#0ea5e9'}
                  blurOnSubmit={true}
                />
              </View>
            </View>

            <Button
              title="Create Account"
              variant="gradient"
              size="lg"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />
          </Card>

          <View style={styles.signinContainer}>
            <Text style={[styles.signinText, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={[styles.signinLink, { color: '#0ea5e9' }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = require('react-native').StyleSheet.create({
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
  errorCard: {
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  errorClose: {
    padding: 4,
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  nameField: {
    flex: 1,
  },
  registerButton: {
    marginTop: 8,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 32,
  },
  signinText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signinLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});