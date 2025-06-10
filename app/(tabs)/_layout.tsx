import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { isDark } = useTheme();

  return (
    <ProtectedRoute>
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderTopColor: isDark ? '#334155' : '#e2e8f0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => {
            const Ionicons = require('@expo/vector-icons').Ionicons;
            return <Ionicons name={focused ? "home" : "home-outline"} size={28} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="new-reminder"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, focused }) => {
            const Ionicons = require('@expo/vector-icons').Ionicons;
            return <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={28} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => {
            const Ionicons = require('@expo/vector-icons').Ionicons;
            return <Ionicons name={focused ? "settings" : "settings-outline"} size={28} color={color} />;
          },
        }}
      />
    </Tabs>
    </ProtectedRoute>
  );
}
