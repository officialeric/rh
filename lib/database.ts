import * as SQLite from 'expo-sqlite';

// Database configuration
const DATABASE_NAME = 'smart_reminder.db';
const DATABASE_VERSION = 1;

// Database instance (will be initialized asynchronously)
let db: SQLite.SQLiteDatabase | null = null;
let isInitialized = false;

// Get database instance
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (!db) {
      console.log('Opening database:', DATABASE_NAME);
      db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log('Database opened successfully');

      // Test the connection immediately
      await db.getFirstAsync('SELECT 1 as test');
      console.log('Database connection verified');
    }

    // Ensure database is initialized
    if (!isInitialized) {
      console.log('Database not initialized, initializing now...');
      await initializeDatabase();
      isInitialized = true;
    }

    return db;
  } catch (error) {
    console.error('Failed to get database:', error);
    throw new Error('Database connection failed');
  }
};

// Reset database (for development/testing)
export const resetDatabase = async (): Promise<void> => {
  try {
    const database = await getDatabase();

    // Drop existing tables
    await database.execAsync(`DROP TABLE IF EXISTS reminders;`);
    await database.execAsync(`DROP TABLE IF EXISTS users;`);
    console.log('Existing tables dropped');

    // Reinitialize
    await initializeDatabase();
  } catch (error) {
    console.error('Database reset failed:', error);
    throw error;
  }
};

// Database initialization
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Get database directly to avoid circular dependency
    if (!db) {
      console.log('Opening database for initialization:', DATABASE_NAME);
      db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      console.log('Database opened for initialization');
    }
    const database = db;

    // Enable foreign key constraints first
    await database.execAsync(`PRAGMA foreign_keys = ON;`);

    // Check if users table exists and has the correct schema
    try {
      await database.execAsync(`SELECT password, phone, bio, profilePicture FROM users LIMIT 1;`);
      console.log('Users table exists with correct schema');
    } catch (error) {
      // Table doesn't exist or has schema issues, drop and recreate
      console.log('Dropping existing users table due to schema issues');
      await database.execAsync(`DROP TABLE IF EXISTS users;`);

      // Create users table with enhanced profile schema
      await database.execAsync(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT,
        bio TEXT,
        profilePicture TEXT,
        profileCompletionScore INTEGER DEFAULT 0,
        lastLoginAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`);
      console.log('Users table created with enhanced profile schema');
    }

    // Check if reminders table exists and has correct schema
    try {
      await database.execAsync(`SELECT userId FROM reminders LIMIT 1;`);
      console.log('Reminders table exists with correct schema');
    } catch (error) {
      // Table doesn't exist or has schema issues, drop and recreate
      console.log('Dropping existing reminders table due to schema issues');
      await database.execAsync(`DROP TABLE IF EXISTS reminders;`);

      // Create reminders table (for future use)
      await database.execAsync(`CREATE TABLE reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        dueDate TEXT,
        dueTime TEXT,
        notes TEXT,
        isCompleted INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      );`);
      console.log('Reminders table created successfully');
    }

    // Create indexes for better performance
    await database.execAsync(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);`);
    console.log('Users email index created successfully');

    await database.execAsync(`CREATE INDEX IF NOT EXISTS idx_reminders_userId ON reminders (userId);`);
    console.log('Reminders userId index created successfully');

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Database migration function (for future schema updates)
export const migrateDatabase = async (currentVersion: number): Promise<void> => {
  if (currentVersion < DATABASE_VERSION) {
    // Add migration logic here when needed
    console.log(`Migrating database from version ${currentVersion} to ${DATABASE_VERSION}`);
  }
};

// User interface
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  profileCompletionScore?: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Database result interfaces
export interface DatabaseResult {
  insertId?: number;
  rowsAffected: number;
}

export interface DatabaseError {
  message: string;
  code?: number;
}
