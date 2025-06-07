import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Mock data for reminders
const mockReminders = [
  {
    id: 1,
    title: 'Math Assignment Due',
    description: 'Complete calculus homework problems 1-20',
    category: 'assignment',
    dueDate: '2024-01-15T10:00:00Z',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Physics Lab Report',
    description: 'Submit lab report on electromagnetic fields',
    category: 'assignment',
    dueDate: '2024-01-16T23:59:00Z',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Study Group Meeting',
    description: 'Chemistry study session in library',
    category: 'meeting',
    dueDate: '2024-01-17T14:00:00Z',
    priority: 'low',
  },
  {
    id: 4,
    title: 'Final Exam - Biology',
    description: 'Comprehensive biology final examination',
    category: 'exam',
    dueDate: '2024-01-20T09:00:00Z',
    priority: 'high',
  },
];

const categoryInfo = {
  assignment: { name: 'Assignment', icon: 'document-text', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  exam: { name: 'Exam', icon: 'school', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  meeting: { name: 'Meeting', icon: 'people', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  personal: { name: 'Personal', icon: 'person', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.1)' },
};

const priorityColors = {
  high: { bg: '#fef2f2', border: '#ef4444', text: '#dc2626' },
  medium: { bg: '#fffbeb', border: '#f59e0b', text: '#d97706' },
  low: { bg: '#f0fdf4', border: '#22c55e', text: '#16a34a' },
};

export default function HomeScreen() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    return `${Math.ceil(diffDays / 7)} weeks`;
  };

  const filteredReminders = selectedCategory === 'all' 
    ? mockReminders 
    : mockReminders.filter(r => r.category === selectedCategory);

  const handleReminderPress = (reminder: any) => {
    router.push(`/reminder/${reminder.id}`);
  };

  const handleNewReminder = () => {
    router.push('/(tabs)/new-reminder');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const stats = [
    { label: 'Total', value: '24', icon: 'calendar', color: '#3b82f6' },
    { label: 'Today', value: '3', icon: 'today', color: '#ef4444' },
    { label: 'This Week', value: '8', icon: 'time', color: '#10b981' },
    { label: 'Completed', value: '18', icon: 'checkmark-circle', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[
          styles.header,
          { backgroundColor: isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)' }
        ]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                Good Morning! ���
              </Text>
              <Text style={[styles.subGreeting, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                You have {mockReminders.length} upcoming reminders
              </Text>
            </View>
            <TouchableOpacity onPress={handleProfile} style={styles.profileButton}>
              <View style={[
                styles.profileGradient,
                { backgroundColor: '#0ea5e9' }
              ]}>
                <Ionicons name="person" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Overview
          </Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Card key={index} variant="elevated" style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  {stat.label}
                </Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <Button
              title="New Reminder"
              variant="gradient"
              size="lg"
              onPress={handleNewReminder}
              leftIcon={<Ionicons name="add" size={20} color="white" />}
              style={styles.actionButton}
            />
            <Button
              title="View All"
              variant="outlined"
              size="lg"
              onPress={() => router.push('/reminders')}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Categories
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <View style={styles.categoryList}>
              {['all', 'assignment', 'exam', 'meeting', 'personal'].map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: selectedCategory === category
                        ? '#0ea5e9'
                        : isDark ? '#1e293b' : '#ffffff',
                      borderColor: selectedCategory === category
                        ? '#0ea5e9'
                        : isDark ? '#334155' : '#e2e8f0',
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: selectedCategory === category
                          ? '#ffffff'
                          : isDark ? '#cbd5e1' : '#475569',
                      }
                    ]}
                  >
                    {category === 'all' ? 'All' : categoryInfo[category as keyof typeof categoryInfo]?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Upcoming Reminders */}
        <View style={styles.remindersContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
            Upcoming Reminders
          </Text>
          
          {filteredReminders.length === 0 ? (
            <Card variant="elevated" style={styles.emptyCard}>
              <Ionicons 
                name="calendar-outline" 
                size={48} 
                color={isDark ? '#64748b' : '#94a3b8'} 
              />
              <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                No reminders in this category
              </Text>
            </Card>
          ) : (
            <View style={styles.remindersList}>
              {filteredReminders.map((reminder) => {
                const categoryData = categoryInfo[reminder.category as keyof typeof categoryInfo];
                const priorityData = priorityColors[reminder.priority as keyof typeof priorityColors];
                
                return (
                  <TouchableOpacity
                    key={reminder.id}
                    onPress={() => handleReminderPress(reminder)}
                  >
                    <Card variant="elevated" style={styles.reminderCard}>
                      <View style={styles.reminderHeader}>
                        <View style={[styles.categoryIcon, { backgroundColor: categoryData.bgColor }]}>
                          <Ionicons
                            name={categoryData.icon as any}
                            size={20}
                            color={categoryData.color}
                          />
                        </View>
                        <View style={[
                          styles.priorityBadge,
                          { 
                            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : priorityData.bg,
                            borderColor: priorityData.border,
                          }
                        ]}>
                          <Text style={[
                            styles.priorityText,
                            { color: priorityData.text }
                          ]}>
                            {reminder.priority}
                          </Text>
                        </View>
                      </View>
                      
                      <Text style={[styles.reminderTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                        {reminder.title}
                      </Text>
                      <Text style={[styles.reminderDescription, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        {reminder.description}
                      </Text>
                      
                      <View style={styles.reminderFooter}>
                        <View style={styles.dueDateContainer}>
                          <Ionicons name="time" size={16} color="#0ea5e9" />
                          <Text style={[styles.dueDate, { color: '#0ea5e9' }]}>
                            Due {formatDate(reminder.dueDate)}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={isDark ? '#64748b' : '#94a3b8'} />
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    fontWeight: '500',
  },
  profileButton: {
    marginLeft: 16,
  },
  profileGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 32,
  },
  categoryScroll: {
    paddingLeft: 24,
  },
  categoryList: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  remindersContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
  },
  remindersList: {
    gap: 16,
  },
  reminderCard: {
    padding: 20,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  reminderDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  reminderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});
