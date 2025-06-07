import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/contexts/ThemeContext";
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
    TouchableOpacity,
    View
} from "react-native";

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = () => {
    router.replace("/(tabs)");
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

          <Card variant="elevated" style={styles.formCard}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChangeText={(text) => setFormData(prev => ({...prev, firstName: text}))}
                  variant="outlined"
                />
              </View>
              <View style={styles.nameField}>
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChangeText={(text) => setFormData(prev => ({...prev, lastName: text}))}
                  variant="outlined"
                />
              </View>
            </View>

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              variant="outlined"
            />

            <Input
              label="Password"
              placeholder="Create password"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({...prev, password: text}))}
              secureTextEntry
              leftIcon="lock-closed"
              variant="outlined"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData(prev => ({...prev, confirmPassword: text}))}
              secureTextEntry
              leftIcon="lock-closed"
              variant="outlined"
            />

            <Button
              title="Create Account"
              variant="gradient"
              size="lg"
              onPress={handleRegister}
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
  formCard: {
    marginBottom: 24,
    paddingVertical: 32,
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