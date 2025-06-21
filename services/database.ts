import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, CREATE_INDEXES } from '@/types/database';

class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.db = await SQLite.openDatabaseAsync('college_reminder.db');
      await this.createTables();
      await this.createIndexes();
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database initialization failed');
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.execAsync(CREATE_TABLES.users);
      await this.db.execAsync(CREATE_TABLES.reminders);
      await this.db.execAsync(CREATE_TABLES.feedback);
      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw error;
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.execAsync(CREATE_INDEXES.userEmail);
      await this.db.execAsync(CREATE_INDEXES.reminderUserId);
      await this.db.execAsync(CREATE_INDEXES.reminderDueDate);
      await this.db.execAsync(CREATE_INDEXES.feedbackUserId);
      await this.db.execAsync(CREATE_INDEXES.feedbackStatus);
      console.log('Database indexes created successfully');
    } catch (error) {
      console.error('Failed to create indexes:', error);
      throw error;
    }
  }

  public getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db || !this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  public async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
      console.log('Database closed');
    }
  }

  // Utility method to run queries with error handling
  public async runQuery<T>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    const db = this.getDatabase();
    try {
      const result = await db.getAllAsync(query, params);
      return result as T[];
    } catch (error) {
      console.error('Query execution failed:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }

  // Utility method to run insert/update/delete queries
  public async runStatement(
    query: string,
    params: any[] = []
  ): Promise<SQLite.SQLiteRunResult> {
    const db = this.getDatabase();
    try {
      const result = await db.runAsync(query, params);
      return result;
    } catch (error) {
      console.error('Statement execution failed:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }

  // Get the first row from a query result
  public async getFirstRow<T>(
    query: string,
    params: any[] = []
  ): Promise<T | null> {
    const db = this.getDatabase();
    try {
      const result = await db.getFirstAsync(query, params);
      return result as T | null;
    } catch (error) {
      console.error('Query execution failed:', error);
      console.error('Query:', query);
      console.error('Params:', params);
      throw error;
    }
  }

  // Transaction support
  public async runTransaction(
    callback: (db: SQLite.SQLiteDatabase) => Promise<void>
  ): Promise<void> {
    const db = this.getDatabase();
    try {
      await db.withTransactionAsync(callback);
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  // Clear all data (for development/testing)
  public async clearAllData(): Promise<void> {
    const db = this.getDatabase();
    try {
      await db.execAsync('DELETE FROM feedback;');
      await db.execAsync('DELETE FROM reminders;');
      await db.execAsync('DELETE FROM users;');
      console.log('All data cleared from database');
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  // Get database info for debugging
  public async getDatabaseInfo(): Promise<any> {
    const db = this.getDatabase();
    try {
      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      const userCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM users;');
      const reminderCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM reminders;');
      const feedbackCount = await db.getFirstAsync('SELECT COUNT(*) as count FROM feedback;');

      return {
        tables,
        counts: {
          users: userCount,
          reminders: reminderCount,
          feedback: feedbackCount
        }
      };
    } catch (error) {
      console.error('Failed to get database info:', error);
      throw error;
    }
  }
}

export default DatabaseService;
