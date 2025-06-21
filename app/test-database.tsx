import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { UserService } from '@/services/userService';
import { UserDatabaseService } from '@/services/userDatabase';
import { ReminderDatabaseService } from '@/services/reminderDatabase';
import { FeedbackDatabaseService } from '@/services/feedbackDatabase';
import DatabaseService from '@/services/database';

export default function TestDatabaseScreen() {
  const { isDark } = useTheme();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, message]);
  };

  const runDatabaseTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      addResult('🚀 Starting database tests...');
      
      // Test 1: Initialize database
      addResult('1. Initializing database...');
      await UserService.initialize();
      addResult('✅ Database initialized successfully');
      
      // Test 2: Create a test user
      addResult('2. Creating test user...');
      const userResult = await UserDatabaseService.createUser({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        university: 'Test University',
        major: 'Computer Science',
        year: 'Senior'
      });
      
      if (userResult.success && userResult.data) {
        addResult(`✅ User created: ${userResult.data.firstName} ${userResult.data.lastName}`);
        const userId = parseInt(userResult.data.id);
        
        // Test 3: Authenticate user
        addResult('3. Testing user authentication...');
        const authResult = await UserDatabaseService.authenticateUser(
          userResult.data.email, 
          'password123'
        );
        
        if (authResult.success) {
          addResult('✅ User authentication successful');
        } else {
          addResult(`❌ Authentication failed: ${authResult.error?.message}`);
        }
        
        // Test 4: Create test reminders
        addResult('4. Creating test reminders...');
        const reminderData = [
          {
            userId,
            title: 'Math Assignment',
            description: 'Complete calculus homework',
            dueDate: '2024-01-15',
            priority: 'high' as const
          },
          {
            userId,
            title: 'Study for Physics Exam',
            description: 'Review chapters 1-5',
            dueDate: '2024-01-20',
            priority: 'medium' as const
          }
        ];
        
        let reminderCount = 0;
        for (const reminder of reminderData) {
          const reminderResult = await ReminderDatabaseService.createReminder(reminder);
          if (reminderResult.success) {
            reminderCount++;
            addResult(`✅ Reminder created: ${reminderResult.data?.title}`);
          } else {
            addResult(`❌ Reminder creation failed: ${reminderResult.error?.message}`);
          }
        }
        
        // Test 5: Get user reminders
        addResult('5. Retrieving user reminders...');
        const remindersResult = await ReminderDatabaseService.getUserReminders(userId);
        
        if (remindersResult.success && remindersResult.data) {
          addResult(`✅ Retrieved ${remindersResult.data.length} reminders`);
          remindersResult.data.forEach(reminder => {
            addResult(`  - ${reminder.title} (${reminder.priority}) - Due: ${reminder.dueDate}`);
          });
        } else {
          addResult(`❌ Failed to retrieve reminders: ${remindersResult.error?.message}`);
        }
        
        // Test 6: Create test feedback
        addResult('6. Creating test feedback...');
        const feedbackResult = await FeedbackDatabaseService.createFeedback({
          userId,
          subject: 'Test Feedback',
          message: 'This is a test feedback message to verify database functionality.'
        });
        
        if (feedbackResult.success) {
          addResult('✅ Feedback created successfully');
        } else {
          addResult(`❌ Feedback creation failed: ${feedbackResult.error?.message}`);
        }
        
        // Test 7: Get user statistics
        addResult('7. Getting user statistics...');
        const statsResult = await UserDatabaseService.getUserStats(userId);
        
        if (statsResult.success && statsResult.data) {
          const stats = statsResult.data;
          addResult('✅ User statistics retrieved:');
          addResult(`  - Total reminders: ${stats.totalReminders}`);
          addResult(`  - Completed: ${stats.completedReminders}`);
          addResult(`  - Pending: ${stats.pendingReminders}`);
          addResult(`  - Weekly: ${stats.weeklyReminders}`);
        } else {
          addResult(`❌ Failed to get statistics: ${statsResult.error?.message}`);
        }
        
        // Test 8: Update user profile
        addResult('8. Updating user profile...');
        const updateResult = await UserDatabaseService.updateUser(userId, {
          phone: '+1234567890',
          year: 'Graduate'
        });
        
        if (updateResult.success) {
          addResult('✅ User profile updated successfully');
        } else {
          addResult(`❌ Profile update failed: ${updateResult.error?.message}`);
        }
        
        // Test 9: Mark reminder as completed
        if (remindersResult.success && remindersResult.data && remindersResult.data.length > 0) {
          addResult('9. Marking reminder as completed...');
          const firstReminder = remindersResult.data[0];
          const completeResult = await ReminderDatabaseService.markAsCompleted(firstReminder.id);
          
          if (completeResult.success) {
            addResult('✅ Reminder marked as completed');
          } else {
            addResult(`❌ Failed to mark reminder as completed: ${completeResult.error?.message}`);
          }
        }
        
        // Test 10: Get database info
        addResult('10. Getting database info...');
        const db = DatabaseService.getInstance();
        const dbInfo = await db.getDatabaseInfo();
        addResult('✅ Database info retrieved:');
        addResult(`  - Tables: ${dbInfo.tables.length}`);
        addResult(`  - Users: ${dbInfo.counts.users?.count || 0}`);
        addResult(`  - Reminders: ${dbInfo.counts.reminders?.count || 0}`);
        addResult(`  - Feedback: ${dbInfo.counts.feedback?.count || 0}`);
        
        addResult('\n🎉 All database tests completed successfully!');
        
      } else {
        addResult(`❌ User creation failed: ${userResult.error?.message}`);
      }
      
    } catch (error) {
      addResult(`❌ Database test failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f0f9ff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
          Database Test Suite
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
          Test SQLite database functionality
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.runButton]}
          onPress={runDatabaseTests}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running Tests...' : 'Run Database Tests'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={[styles.resultsContainer, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}
        showsVerticalScrollIndicator={false}
      >
        {testResults.map((result, index) => (
          <Text 
            key={index} 
            style={[
              styles.resultText, 
              { color: isDark ? '#e2e8f0' : '#374151' },
              result.includes('❌') && styles.errorText,
              result.includes('✅') && styles.successText,
              result.includes('🚀') && styles.headerText,
              result.includes('🎉') && styles.celebrationText
            ]}
          >
            {result}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  runButton: {
    backgroundColor: '#3b82f6',
  },
  clearButton: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  errorText: {
    color: '#dc2626',
  },
  successText: {
    color: '#16a34a',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  celebrationText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#059669',
  },
});
