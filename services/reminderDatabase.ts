import DatabaseService from './database';
import { 
  DbReminder, 
  CreateReminderInput, 
  UpdateReminderInput, 
  DatabaseResult,
  Reminder 
} from '@/types/database';

// Convert database reminder to app reminder (convert isCompleted from number to boolean)
const dbReminderToReminder = (dbReminder: DbReminder): Reminder => ({
  id: dbReminder.id,
  userId: dbReminder.userId,
  title: dbReminder.title,
  description: dbReminder.description,
  dueDate: dbReminder.dueDate,
  isCompleted: dbReminder.isCompleted === 1,
  priority: dbReminder.priority,
  createdAt: dbReminder.createdAt,
  updatedAt: dbReminder.updatedAt
});

export class ReminderDatabaseService {
  private static db = DatabaseService.getInstance();

  // Create a new reminder
  static async createReminder(reminderData: CreateReminderInput): Promise<DatabaseResult<Reminder>> {
    try {
      const now = new Date().toISOString();

      const result = await this.db.runStatement(
        `INSERT INTO reminders (userId, title, description, dueDate, priority, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          reminderData.userId,
          reminderData.title,
          reminderData.description || null,
          reminderData.dueDate,
          reminderData.priority,
          now,
          now
        ]
      );

      const newReminder = await this.db.getFirstRow<DbReminder>(
        'SELECT * FROM reminders WHERE id = ?',
        [result.lastInsertRowId]
      );

      if (!newReminder) {
        return {
          success: false,
          error: {
            code: 'REMINDER_CREATION_FAILED',
            message: 'Failed to create reminder.'
          }
        };
      }

      return {
        success: true,
        data: dbReminderToReminder(newReminder)
      };
    } catch (error) {
      console.error('Error creating reminder:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to create reminder.',
          details: error
        }
      };
    }
  }

  // Get reminder by ID
  static async getReminderById(reminderId: number): Promise<DatabaseResult<Reminder>> {
    try {
      const reminder = await this.db.getFirstRow<DbReminder>(
        'SELECT * FROM reminders WHERE id = ?',
        [reminderId]
      );

      if (!reminder) {
        return {
          success: false,
          error: {
            code: 'REMINDER_NOT_FOUND',
            message: 'Reminder not found.'
          }
        };
      }

      return {
        success: true,
        data: dbReminderToReminder(reminder)
      };
    } catch (error) {
      console.error('Error getting reminder by ID:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve reminder.',
          details: error
        }
      };
    }
  }

  // Get all reminders for a user
  static async getUserReminders(userId: number): Promise<DatabaseResult<Reminder[]>> {
    try {
      const reminders = await this.db.runQuery<DbReminder>(
        'SELECT * FROM reminders WHERE userId = ? ORDER BY dueDate ASC',
        [userId]
      );

      return {
        success: true,
        data: reminders.map(dbReminderToReminder)
      };
    } catch (error) {
      console.error('Error getting user reminders:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve reminders.',
          details: error
        }
      };
    }
  }

  // Get pending reminders for a user
  static async getPendingReminders(userId: number): Promise<DatabaseResult<Reminder[]>> {
    try {
      const reminders = await this.db.runQuery<DbReminder>(
        'SELECT * FROM reminders WHERE userId = ? AND isCompleted = 0 ORDER BY dueDate ASC',
        [userId]
      );

      return {
        success: true,
        data: reminders.map(dbReminderToReminder)
      };
    } catch (error) {
      console.error('Error getting pending reminders:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve pending reminders.',
          details: error
        }
      };
    }
  }

  // Get completed reminders for a user
  static async getCompletedReminders(userId: number): Promise<DatabaseResult<Reminder[]>> {
    try {
      const reminders = await this.db.runQuery<DbReminder>(
        'SELECT * FROM reminders WHERE userId = ? AND isCompleted = 1 ORDER BY updatedAt DESC',
        [userId]
      );

      return {
        success: true,
        data: reminders.map(dbReminderToReminder)
      };
    } catch (error) {
      console.error('Error getting completed reminders:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve completed reminders.',
          details: error
        }
      };
    }
  }

  // Get reminders by priority
  static async getRemindersByPriority(userId: number, priority: 'low' | 'medium' | 'high'): Promise<DatabaseResult<Reminder[]>> {
    try {
      const reminders = await this.db.runQuery<DbReminder>(
        'SELECT * FROM reminders WHERE userId = ? AND priority = ? ORDER BY dueDate ASC',
        [userId, priority]
      );

      return {
        success: true,
        data: reminders.map(dbReminderToReminder)
      };
    } catch (error) {
      console.error('Error getting reminders by priority:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve reminders.',
          details: error
        }
      };
    }
  }

  // Update reminder
  static async updateReminder(reminderId: number, updateData: UpdateReminderInput): Promise<DatabaseResult<Reminder>> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'isCompleted') {
            updates.push(`${key} = ?`);
            values.push(value ? 1 : 0);
          } else {
            updates.push(`${key} = ?`);
            values.push(value);
          }
        }
      });

      if (updates.length === 0) {
        return {
          success: false,
          error: {
            code: 'NO_UPDATES',
            message: 'No updates provided.'
          }
        };
      }

      // Add updatedAt timestamp
      updates.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(reminderId);

      await this.db.runStatement(
        `UPDATE reminders SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Get updated reminder
      const updatedReminder = await this.getReminderById(reminderId);
      return updatedReminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to update reminder.',
          details: error
        }
      };
    }
  }

  // Delete reminder
  static async deleteReminder(reminderId: number): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.db.runStatement(
        'DELETE FROM reminders WHERE id = ?',
        [reminderId]
      );

      return {
        success: result.changes > 0,
        data: result.changes > 0
      };
    } catch (error) {
      console.error('Error deleting reminder:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to delete reminder.',
          details: error
        }
      };
    }
  }

  // Mark reminder as completed
  static async markAsCompleted(reminderId: number): Promise<DatabaseResult<Reminder>> {
    return this.updateReminder(reminderId, { isCompleted: true });
  }

  // Mark reminder as pending
  static async markAsPending(reminderId: number): Promise<DatabaseResult<Reminder>> {
    return this.updateReminder(reminderId, { isCompleted: false });
  }

  // Get overdue reminders
  static async getOverdueReminders(userId: number): Promise<DatabaseResult<Reminder[]>> {
    try {
      const reminders = await this.db.runQuery<DbReminder>(
        `SELECT * FROM reminders 
         WHERE userId = ? AND isCompleted = 0 AND date(dueDate) < date('now')
         ORDER BY dueDate ASC`,
        [userId]
      );

      return {
        success: true,
        data: reminders.map(dbReminderToReminder)
      };
    } catch (error) {
      console.error('Error getting overdue reminders:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve overdue reminders.',
          details: error
        }
      };
    }
  }

  // Get reminders due today
  static async getTodayReminders(userId: number): Promise<DatabaseResult<Reminder[]>> {
    try {
      const reminders = await this.db.runQuery<DbReminder>(
        `SELECT * FROM reminders 
         WHERE userId = ? AND date(dueDate) = date('now')
         ORDER BY dueDate ASC`,
        [userId]
      );

      return {
        success: true,
        data: reminders.map(dbReminderToReminder)
      };
    } catch (error) {
      console.error('Error getting today reminders:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve today\'s reminders.',
          details: error
        }
      };
    }
  }

  // Delete all reminders for a user
  static async deleteUserReminders(userId: number): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.db.runStatement(
        'DELETE FROM reminders WHERE userId = ?',
        [userId]
      );

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Error deleting user reminders:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to delete reminders.',
          details: error
        }
      };
    }
  }
}
