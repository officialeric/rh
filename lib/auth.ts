import * as Crypto from 'expo-crypto';
import { getDatabase, User } from './database';

// Authentication interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hash password using expo-crypto
export const hashPassword = async (password: string): Promise<string> => {
  try {
    // Validate input
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }

    // Create a simple salt
    const salt = Math.random().toString(36).substring(2, 15);
    const saltedPassword = salt + password;

    // Hash using SHA-256
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      saltedPassword,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    // Return salt + hash for verification later
    return salt + ':' + hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    // Validate inputs
    if (!password || typeof password !== 'string') {
      console.error('Invalid password provided to verifyPassword');
      return false;
    }

    if (!hashedPassword || typeof hashedPassword !== 'string') {
      console.error('Invalid hashedPassword provided to verifyPassword');
      return false;
    }

    // Extract salt and hash from stored password
    const [salt, hash] = hashedPassword.split(':');
    if (!salt || !hash) {
      console.error('Invalid hash format');
      return false;
    }

    // Hash the provided password with the same salt
    const saltedPassword = salt + password;
    const computedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      saltedPassword,
      { encoding: Crypto.CryptoEncoding.HEX }
    );

    // Compare hashes
    return computedHash === hash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

// Register user
export const registerUser = async (userData: RegisterData): Promise<AuthResult> => {
  try {
    console.log('Registration attempt with data:', {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      passwordLength: userData.password?.length || 0,
      passwordType: typeof userData.password
    });

    // Validate input
    if (!userData.email || !validateEmail(userData.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (!userData.password || typeof userData.password !== 'string') {
      return { success: false, error: 'Password is required and must be a string' };
    }

    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      return { success: false, error: passwordValidation.errors.join('. ') };
    }

    if (!userData.firstName?.trim() || !userData.lastName?.trim()) {
      return { success: false, error: 'First name and last name are required' };
    }

    console.log('Getting database connection for registration...');
    const db = await getDatabase();
    console.log('Database connection established for registration');

    // Test database connection
    try {
      await db.getFirstAsync('SELECT 1 as test');
      console.log('Database connection test successful for registration');
    } catch (testError) {
      console.error('Database connection test failed for registration:', testError);
      return { success: false, error: 'Database connection failed' };
    }

    // Check if user already exists
    console.log('Checking if user exists...');
    let existingUser;
    try {
      existingUser = await db.getFirstAsync('SELECT id FROM users WHERE email = ?', [userData.email.toLowerCase()]);
      console.log('User existence check completed, exists:', !!existingUser);
    } catch (checkError) {
      console.error('User existence check failed:', checkError);
      return { success: false, error: 'Database query failed' };
    }

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Hash password
    console.log('Hashing password...');
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(userData.password);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Password hashing failed:', hashError);
      return { success: false, error: 'Failed to process password' };
    }

    // Insert new user
    console.log('Inserting new user...');
    let result;
    try {
      result = await db.runAsync(
        `INSERT INTO users (email, password, firstName, lastName, updatedAt)
         VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          userData.email.toLowerCase(),
          hashedPassword,
          userData.firstName.trim(),
          userData.lastName.trim()
        ]
      );
      console.log('User inserted successfully, ID:', result.lastInsertRowId);
    } catch (insertError) {
      console.error('User insertion failed:', insertError);
      return { success: false, error: 'Failed to create user account' };
    }

    // Get the created user with all profile fields
    console.log('Retrieving created user...');
    let user;
    try {
      user = await db.getFirstAsync(
        `SELECT id, email, firstName, lastName, phone, bio, profilePicture,
                profileCompletionScore, lastLoginAt, createdAt, updatedAt
         FROM users WHERE id = ?`,
        [result.lastInsertRowId]
      ) as User;
      console.log('User retrieved successfully:', user?.email);
    } catch (retrieveError) {
      console.error('User retrieval failed:', retrieveError);
      return { success: false, error: 'Failed to retrieve created user' };
    }

    if (user) {
      return { success: true, user };
    } else {
      return { success: false, error: 'Failed to retrieve created user' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
};

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResult> => {
  try {
    console.log('Login attempt for email:', credentials.email);

    // Validate input
    if (!validateEmail(credentials.email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (!credentials.password) {
      return { success: false, error: 'Password is required' };
    }

    console.log('Getting database connection...');
    const db = await getDatabase();
    console.log('Database connection established');

    // Test database connection first
    try {
      await db.getFirstAsync('SELECT 1 as test');
      console.log('Database connection test successful');
    } catch (testError) {
      console.error('Database connection test failed:', testError);
      return { success: false, error: 'Database connection failed' };
    }

    // Check if users table exists
    try {
      await db.getFirstAsync('SELECT COUNT(*) as count FROM users');
      console.log('Users table accessible');
    } catch (tableError) {
      console.error('Users table not accessible:', tableError);
      return { success: false, error: 'Database table not found' };
    }

    console.log('Searching for user with email:', credentials.email.toLowerCase());

    // Find user by email with more robust error handling
    let userData;
    try {
      userData = await db.getFirstAsync<any>('SELECT * FROM users WHERE email = ?', [credentials.email.toLowerCase()]);
      console.log('User query completed, found user:', !!userData);
    } catch (queryError) {
      console.error('User query failed:', queryError);
      return { success: false, error: 'Database query failed' };
    }

    if (!userData) {
      return { success: false, error: 'Invalid email or password' };
    }

    console.log('Verifying password...');
    // Verify password
    const isPasswordValid = await verifyPassword(credentials.password, userData.password);
    console.log('Password verification result:', isPasswordValid);

    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last login time
    try {
      await db.runAsync('UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = ?', [userData.id]);
      console.log('Last login time updated');
    } catch (updateError) {
      console.warn('Failed to update last login time:', updateError);
      // Continue anyway, this is not critical
    }

    // Return user data (without password)
    const user: User = {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      bio: userData.bio,
      profilePicture: userData.profilePicture,
      profileCompletionScore: userData.profileCompletionScore,
      lastLoginAt: userData.lastLoginAt,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };

    console.log('Login successful for user:', user.email);
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
};

// Get user by ID
export const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const db = await getDatabase();
    const user = await db.getFirstAsync<User>(
      `SELECT id, email, firstName, lastName, phone, bio, profilePicture,
              profileCompletionScore, lastLoginAt, createdAt, updatedAt
       FROM users WHERE id = ?`,
      [userId]
    );

    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};
