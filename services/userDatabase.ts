import DatabaseService from './database';
import { 
  DbUser, 
  CreateUserInput, 
  UpdateUserInput, 
  DatabaseResult,
  UserStats 
} from '@/types/database';
import { User } from '@/types/user';

// Simple password hashing (in production, use bcrypt or similar)
const hashPassword = (password: string): string => {
  // This is a simple hash for demo purposes
  // In production, use proper password hashing like bcrypt
  return btoa(password + 'salt_key_here');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Convert database user to app user (remove password hash)
const dbUserToUser = (dbUser: DbUser): User => ({
  id: dbUser.id.toString(),
  firstName: dbUser.firstName,
  lastName: dbUser.lastName,
  email: dbUser.email,
  phone: dbUser.phone || '',
  university: dbUser.university || '',
  major: dbUser.major || '',
  year: dbUser.year || '',
  profilePicture: dbUser.profilePicture,
  createdAt: dbUser.createdAt,
  updatedAt: dbUser.updatedAt
});

export class UserDatabaseService {
  private static db = DatabaseService.getInstance();

  // Create a new user
  static async createUser(userData: CreateUserInput): Promise<DatabaseResult<User>> {
    try {
      // Check if user already exists
      const existingUser = await this.db.getFirstRow<DbUser>(
        'SELECT * FROM users WHERE email = ?',
        [userData.email.toLowerCase()]
      );

      if (existingUser) {
        return {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'An account with this email already exists.'
          }
        };
      }

      // Hash password
      const passwordHash = hashPassword(userData.password);
      const now = new Date().toISOString();

      // Insert new user
      const result = await this.db.runStatement(
        `INSERT INTO users (firstName, lastName, email, passwordHash, phone, university, major, year, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userData.firstName,
          userData.lastName,
          userData.email.toLowerCase(),
          passwordHash,
          userData.phone || null,
          userData.university || null,
          userData.major || null,
          userData.year || null,
          now,
          now
        ]
      );

      // Get the created user
      const newUser = await this.db.getFirstRow<DbUser>(
        'SELECT * FROM users WHERE id = ?',
        [result.lastInsertRowId]
      );

      if (!newUser) {
        return {
          success: false,
          error: {
            code: 'USER_CREATION_FAILED',
            message: 'Failed to create user account.'
          }
        };
      }

      return {
        success: true,
        data: dbUserToUser(newUser)
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to create user account.',
          details: error
        }
      };
    }
  }

  // Authenticate user
  static async authenticateUser(email: string, password: string): Promise<DatabaseResult<User>> {
    try {
      const user = await this.db.getFirstRow<DbUser>(
        'SELECT * FROM users WHERE email = ?',
        [email.toLowerCase()]
      );

      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found. Please check your email or sign up.'
          }
        };
      }

      if (!verifyPassword(password, user.passwordHash)) {
        return {
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Invalid password. Please try again.'
          }
        };
      }

      return {
        success: true,
        data: dbUserToUser(user)
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Authentication failed.',
          details: error
        }
      };
    }
  }

  // Get user by ID
  static async getUserById(userId: number): Promise<DatabaseResult<User>> {
    try {
      const user = await this.db.getFirstRow<DbUser>(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (!user) {
        return {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found.'
          }
        };
      }

      return {
        success: true,
        data: dbUserToUser(user)
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve user.',
          details: error
        }
      };
    }
  }

  // Update user
  static async updateUser(userId: number, updateData: UpdateUserInput): Promise<DatabaseResult<User>> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
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
      values.push(userId);

      await this.db.runStatement(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Get updated user
      const updatedUser = await this.getUserById(userId);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to update user.',
          details: error
        }
      };
    }
  }

  // Delete user
  static async deleteUser(userId: number): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.db.runStatement(
        'DELETE FROM users WHERE id = ?',
        [userId]
      );

      return {
        success: result.changes > 0,
        data: result.changes > 0
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to delete user.',
          details: error
        }
      };
    }
  }

  // Get user statistics
  static async getUserStats(userId: number): Promise<DatabaseResult<UserStats>> {
    try {
      const stats = await this.db.getFirstRow<any>(
        `SELECT 
          COUNT(*) as totalReminders,
          SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completedReminders,
          SUM(CASE WHEN isCompleted = 0 THEN 1 ELSE 0 END) as pendingReminders,
          SUM(CASE WHEN date(dueDate) >= date('now', '-7 days') THEN 1 ELSE 0 END) as weeklyReminders
         FROM reminders 
         WHERE userId = ?`,
        [userId]
      );

      const userStats: UserStats = {
        totalReminders: stats?.totalReminders || 0,
        completedReminders: stats?.completedReminders || 0,
        pendingReminders: stats?.pendingReminders || 0,
        weeklyReminders: stats?.weeklyReminders || 0
      };

      return {
        success: true,
        data: userStats
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve user statistics.',
          details: error
        }
      };
    }
  }

  // Get all users (for admin purposes)
  static async getAllUsers(): Promise<DatabaseResult<User[]>> {
    try {
      const users = await this.db.runQuery<DbUser>('SELECT * FROM users ORDER BY createdAt DESC');
      return {
        success: true,
        data: users.map(dbUserToUser)
      };
    } catch (error) {
      console.error('Error getting all users:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve users.',
          details: error
        }
      };
    }
  }
}
