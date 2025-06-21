// User data interfaces
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  university?: string;
  major?: string;
  year?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication interfaces
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  university?: string;
  major?: string;
  year?: string;
}

// API Response interfaces
export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  university?: string;
  major?: string;
  year?: string;
}

// User statistics for profile display
export interface UserStats {
  totalReminders: number;
  completedReminders: number;
  pendingReminders: number;
  weeklyReminders: number;
}

// Profile sections data
export interface ProfileSection {
  title: string;
  data: Record<string, any>;
}

export interface ProfileData {
  personalInfo: ProfileSection;
  academicInfo: ProfileSection;
  statistics: UserStats;
}

// Error types
export interface UserError {
  code: string;
  message: string;
  field?: string;
}

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  AUTH_TOKEN: '@auth_token',
  IS_AUTHENTICATED: '@is_authenticated',
} as const;
