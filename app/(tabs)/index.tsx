import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useReminders } from '@/contexts/ReminderContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Simple category detection based on title keywords
const detectCategory = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('assignment') || lowerTitle.includes('homework') || lowerTitle.includes('project')) {
    return 'assignment';
  }
  if (lowerTitle.includes('exam') || lowerTitle.includes('test') || lowerTitle.includes('quiz')) {
    return 'exam';
  }
  if (lowerTitle.includes('meeting') || lowerTitle.includes('study group') || lowerTitle.includes('class')) {
    return 'meeting';
  }
  return 'personal';
};

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
  const { user } = useUser();
  const {
    reminders,
    isLoading,
    error,
    loadUserReminders,
    getTodayReminders,
    getCompletedReminders,
    getPendingReminders
  } = useReminders();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentGreeting, setCurrentGreeting] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    completed: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

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
    ? (reminders || [])
    : (reminders || []).filter(r => {
        // Detect category from title
        const detectedCategory = detectCategory(r.title);
        return detectedCategory === selectedCategory;
      });

  const handleReminderPress = (reminder: any) => {
    router.push(`/reminder/${reminder.id}`);
  };

  const handleNewReminder = () => {
    router.push('/(tabs)/new-reminder');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  // Function to get appropriate greeting based on current time
  const getTimeBasedGreeting = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const userName = user?.firstName || 'there';

    // Different greetings based on time of day
    if (currentHour >= 5 && currentHour < 12) {
      // Morning: 5 AM - 12 PM
      if (currentHour < 7) {
        return `Good Early Morning, ${userName}! 🌅`;
      } else if (currentHour < 10) {
        return `Good Morning, ${userName}! ☀️`;
      } else {
        return `Good Late Morning, ${userName}! 🌤️`;
      }
    } else if (currentHour >= 12 && currentHour < 17) {
      // Afternoon: 12 PM - 5 PM
      if (currentHour === 12) {
        return `Good Noon, ${userName}! 🌞`;
      } else if (currentHour < 15) {
        return `Good Afternoon, ${userName}! ☀️`;
      } else {
        return `Good Late Afternoon, ${userName}! 🌅`;
      }
    } else if (currentHour >= 17 && currentHour < 21) {
      // Evening: 5 PM - 9 PM
      if (currentHour < 19) {
        return `Good Evening, ${userName}! 🌆`;
      } else {
        return `Good Late Evening, ${userName}! 🌇`;
      }
    } else {
      // Night: 9 PM - 5 AM
      if (currentHour < 23) {
        return `Good Night, ${userName}! 🌙`;
      } else {
        return `Good Late Night, ${userName}! 🌌`;
      }
    }
  };

  // Function to get contextual sub-greeting
  const getSubGreeting = () => {
    const totalReminders = (reminders || []).length;
    const currentHour = new Date().getHours();

    if (totalReminders === 0) {
      if (currentHour >= 5 && currentHour < 12) {
        return "Start your day by adding some reminders!";
      } else if (currentHour >= 12 && currentHour < 17) {
        return "Your schedule is clear. Time to plan ahead!";
      } else {
        return "No reminders for now. Enjoy your free time!";
      }
    } else if (totalReminders === 1) {
      return "You have 1 upcoming reminder";
    } else if (totalReminders <= 5) {
      return `You have ${totalReminders} upcoming reminders`;
    } else {
      return `You have ${totalReminders} reminders. Stay organized!`;
    }
  };

  // Update greeting when component mounts and user changes
  useEffect(() => {
    const updateGreeting = () => {
      setCurrentGreeting(getTimeBasedGreeting());
    };

    updateGreeting();

    // Update greeting every minute to keep it current
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, [user]);

  // Load data when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Calculate stats when reminders change
  useEffect(() => {
    calculateStats();
  }, [reminders]);

  const loadDashboardData = async () => {
    if (!user) return;

    setIsLoadingStats(true);
    try {
      // Fetch user reminders
      await loadUserReminders(parseInt(user.id));

      // Stats will be calculated in useEffect when reminders change
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const calculateStats = () => {
    if (!reminders) return;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());

    const weekReminders = reminders.filter(r => {
      const dueDate = new Date(r.dueDate);
      return dueDate >= weekStart;
    });

    setStats({
      total: reminders.length,
      today: getTodayReminders().length,
      thisWeek: weekReminders.length,
      completed: getCompletedReminders().length
    });
  };

  const statsDisplay = [
    { label: 'Total', value: stats.total.toString(), icon: 'calendar', color: '#3b82f6' },
    { label: 'Today', value: stats.today.toString(), icon: 'today', color: '#ef4444' },
    { label: 'This Week', value: stats.thisWeek.toString(), icon: 'time', color: '#10b981' },
    { label: 'Completed', value: stats.completed.toString(), icon: 'checkmark-circle', color: '#8b5cf6' },
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
                {currentGreeting || getTimeBasedGreeting()}
              </Text>
              <Text style={[styles.subGreeting, { color: isDark ? '#cbd5e1' : '#64748b' }]}>
                {getSubGreeting()}
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
            {isLoadingStats ? (
              <ActivityIndicator size="large" color="#0ea5e9" />
            ) : (
              statsDisplay.map((stat, index) => (
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
              ))
            )}
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
              style={styles.fullWidthButton}
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
          
          {isLoading ? (
            <Card variant="elevated" style={styles.emptyCard}>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                Loading reminders...
              </Text>
            </Card>
          ) : filteredReminders.length === 0 ? (
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
                const detectedCategory = detectCategory(reminder.title);
                const categoryData = categoryInfo[detectedCategory as keyof typeof categoryInfo];
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
  fullWidthButton: {
    width: '100%',
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
