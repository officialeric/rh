// Database model interfaces
export interface DbUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  university?: string;
  major?: string;
  year?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbReminder {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: number; // SQLite uses 0/1 for boolean
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface DbFeedback {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

// Input interfaces for creating/updating records
export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  university?: string;
  major?: string;
  year?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  university?: string;
  major?: string;
  year?: string;
}

export interface CreateReminderInput {
  userId: number;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateReminderInput {
  title?: string;
  description?: string;
  dueDate?: string;
  isCompleted?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface CreateFeedbackInput {
  userId: number;
  subject: string;
  message: string;
}

export interface UpdateFeedbackInput {
  subject?: string;
  message?: string;
  status?: 'pending' | 'reviewed' | 'resolved';
}

// Converted interfaces for app use (with proper boolean types)
export interface Reminder {
  id: number;
  userId: number;
  title: string;
  description?: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

// Database query result types
export interface UserStats {
  totalReminders: number;
  completedReminders: number;
  pendingReminders: number;
  weeklyReminders: number;
}

// Database error types
export interface DatabaseError {
  code: string;
  message: string;
  details?: any;
}

// Database operation result types
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: DatabaseError;
}

// SQL table creation statements
export const CREATE_TABLES = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      phone TEXT,
      university TEXT,
      major TEXT,
      year TEXT,
      profilePicture TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
  reminders: `
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT NOT NULL,
      isCompleted INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'medium',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );
  `,
  feedback: `
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );
  `
};

// Database indexes for better performance
export const CREATE_INDEXES = {
  userEmail: `CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);`,
  reminderUserId: `CREATE INDEX IF NOT EXISTS idx_reminders_userId ON reminders (userId);`,
  reminderDueDate: `CREATE INDEX IF NOT EXISTS idx_reminders_dueDate ON reminders (dueDate);`,
  feedbackUserId: `CREATE INDEX IF NOT EXISTS idx_feedback_userId ON feedback (userId);`,
  feedbackStatus: `CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback (status);`
};
