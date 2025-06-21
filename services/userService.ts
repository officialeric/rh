import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  STORAGE_KEYS,
  User,
  UserStats,
  UserUpdateData
} from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatabaseService from './database';
import { UserDatabaseService } from './userDatabase';

// Authentication Service
export class UserService {
  // Initialize database
  static async initialize(): Promise<void> {
    const db = DatabaseService.getInstance();
    await db.initialize();
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await this.initialize();

      const result = await UserDatabaseService.authenticateUser(
        credentials.email,
        credentials.password
      );

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error?.message || 'Login failed. Please try again.',
        };
      }

      const user = result.data;
      const token = `token_${user.id}_${Date.now()}`;

      // Store authentication data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');

      return {
        success: true,
        user,
        token,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  // Register new user
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      await this.initialize();

      // Validate password confirmation
      if (userData.password !== userData.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match.',
        };
      }

      const result = await UserDatabaseService.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        university: userData.university,
        major: userData.major,
        year: userData.year,
      });

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error?.message || 'Registration failed. Please try again.',
        };
      }

      const user = result.data;
      const token = `token_${user.id}_${Date.now()}`;

      // Store authentication data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');

      return {
        success: true,
        user,
        token,
        message: 'Account created successfully',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  // Get current user from storage
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const isAuth = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return isAuth === 'true' && !!token;
    } catch (error) {
      return false;
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updateData: UserUpdateData): Promise<AuthResponse> {
    try {
      await this.initialize();

      const result = await UserDatabaseService.updateUser(parseInt(userId), updateData);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error?.message || 'Failed to update profile. Please try again.',
        };
      }

      const updatedUser = result.data;

      // Update in storage
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));

      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'Failed to update profile. Please try again.',
      };
    }
  }

  // Get user statistics
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      await this.initialize();

      const result = await UserDatabaseService.getUserStats(parseInt(userId));

      if (result.success && result.data) {
        return result.data;
      }

      // Return default stats if query fails
      return {
        totalReminders: 0,
        completedReminders: 0,
        pendingReminders: 0,
        weeklyReminders: 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalReminders: 0,
        completedReminders: 0,
        pendingReminders: 0,
        weeklyReminders: 0,
      };
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.IS_AUTHENTICATED,
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Clear all user data (for testing/development)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      await this.initialize();
      const db = DatabaseService.getInstance();
      await db.clearAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
