// Test script to verify database functionality
// This would be run in a React Native environment

const testDatabaseFunctionality = async () => {
  try {
    console.log('Starting database tests...');
    
    // Test 1: Initialize database
    console.log('1. Initializing database...');
    const DatabaseService = require('../services/database').default;
    const { UserDatabaseService } = require('../services/userDatabase');
    const { ReminderDatabaseService } = require('../services/reminderDatabase');
    const { FeedbackDatabaseService } = require('../services/feedbackDatabase');
    
    const db = DatabaseService.getInstance();
    await db.initialize();
    console.log('✓ Database initialized successfully');
    
    // Test 2: Create a test user
    console.log('2. Creating test user...');
    const userResult = await UserDatabaseService.createUser({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      university: 'Test University',
      major: 'Computer Science',
      year: 'Senior'
    });
    
    if (userResult.success) {
      console.log('✓ User created successfully:', userResult.data);
    } else {
      console.log('✗ User creation failed:', userResult.error);
      return;
    }
    
    const userId = parseInt(userResult.data.id);
    
    // Test 3: Authenticate user
    console.log('3. Testing user authentication...');
    const authResult = await UserDatabaseService.authenticateUser('test@example.com', 'password123');
    
    if (authResult.success) {
      console.log('✓ User authentication successful');
    } else {
      console.log('✗ User authentication failed:', authResult.error);
    }
    
    // Test 4: Create test reminders
    console.log('4. Creating test reminders...');
    const reminderData = [
      {
        userId,
        title: 'Math Assignment',
        description: 'Complete calculus homework',
        dueDate: '2024-01-15',
        priority: 'high'
      },
      {
        userId,
        title: 'Study for Physics Exam',
        description: 'Review chapters 1-5',
        dueDate: '2024-01-20',
        priority: 'medium'
      }
    ];
    
    for (const reminder of reminderData) {
      const reminderResult = await ReminderDatabaseService.createReminder(reminder);
      if (reminderResult.success) {
        console.log('✓ Reminder created:', reminderResult.data.title);
      } else {
        console.log('✗ Reminder creation failed:', reminderResult.error);
      }
    }
    
    // Test 5: Get user reminders
    console.log('5. Retrieving user reminders...');
    const remindersResult = await ReminderDatabaseService.getUserReminders(userId);
    
    if (remindersResult.success) {
      console.log('✓ Retrieved reminders:', remindersResult.data.length);
      remindersResult.data.forEach(reminder => {
        console.log(`  - ${reminder.title} (${reminder.priority}) - Due: ${reminder.dueDate}`);
      });
    } else {
      console.log('✗ Failed to retrieve reminders:', remindersResult.error);
    }
    
    // Test 6: Create test feedback
    console.log('6. Creating test feedback...');
    const feedbackResult = await FeedbackDatabaseService.createFeedback({
      userId,
      subject: 'Test Feedback',
      message: 'This is a test feedback message to verify the database functionality.'
    });
    
    if (feedbackResult.success) {
      console.log('✓ Feedback created successfully');
    } else {
      console.log('✗ Feedback creation failed:', feedbackResult.error);
    }
    
    // Test 7: Get user statistics
    console.log('7. Getting user statistics...');
    const statsResult = await UserDatabaseService.getUserStats(userId);
    
    if (statsResult.success) {
      console.log('✓ User statistics:', statsResult.data);
    } else {
      console.log('✗ Failed to get user statistics:', statsResult.error);
    }
    
    // Test 8: Update user profile
    console.log('8. Updating user profile...');
    const updateResult = await UserDatabaseService.updateUser(userId, {
      phone: '+1234567890',
      year: 'Graduate'
    });
    
    if (updateResult.success) {
      console.log('✓ User profile updated successfully');
    } else {
      console.log('✗ User profile update failed:', updateResult.error);
    }
    
    // Test 9: Mark reminder as completed
    console.log('9. Marking reminder as completed...');
    if (remindersResult.success && remindersResult.data.length > 0) {
      const firstReminder = remindersResult.data[0];
      const completeResult = await ReminderDatabaseService.markAsCompleted(firstReminder.id);
      
      if (completeResult.success) {
        console.log('✓ Reminder marked as completed');
      } else {
        console.log('✗ Failed to mark reminder as completed:', completeResult.error);
      }
    }
    
    // Test 10: Get database info
    console.log('10. Getting database info...');
    const dbInfo = await db.getDatabaseInfo();
    console.log('✓ Database info:', dbInfo);
    
    console.log('\n🎉 All database tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
};

// Export for use in React Native app
module.exports = { testDatabaseFunctionality };

// Instructions for running this test:
console.log(`
To test the database functionality:

1. Import this test in your React Native app:
   import { testDatabaseFunctionality } from './scripts/testDatabase';

2. Call the test function in a component:
   useEffect(() => {
     testDatabaseFunctionality();
   }, []);

3. Check the console output for test results.

Note: This test creates sample data. In production, you may want to clear
test data after running the tests.
`);
