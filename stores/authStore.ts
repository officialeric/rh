import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthResult, getUserById, LoginCredentials, loginUser, RegisterData, registerUser } from '../lib/auth';
import { User } from '../lib/database';

// Profile management types
interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface ProfileStats {
  totalReminders: number;
  completedReminders: number;
  pendingReminders: number;
  completionRate: number;
}

// Authentication state interface
interface AuthState {
  // State
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  profileStats: ProfileStats | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  updateUser: (user: User) => void;

  // Profile Management Actions
  updateProfile: (data: ProfileUpdateData) => Promise<ProfileResult>;
  changePassword: (data: PasswordChangeData) => Promise<ProfileResult>;
  refreshProfileStats: () => Promise<void>;
}

// Create the authentication store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      error: null,
      profileStats: null,

      // Login action
      login: async (credentials: LoginCredentials): Promise<AuthResult> => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await loginUser(credentials);
          
          if (result.success && result.user) {
            set({
              isAuthenticated: true,
              currentUser: result.user,
              isLoading: false,
              error: null
            });

            // Update last login and refresh profile stats
            try {
              const { updateLastLogin } = await import('../lib/profile');
              await updateLastLogin(result.user.id);
              await get().refreshProfileStats();
            } catch (error) {
              console.error('Error updating login info:', error);
            }
          } else {
            set({
              isAuthenticated: false,
              currentUser: null,
              isLoading: false,
              error: result.error || 'Login failed'
            });
          }
          
          return result;
        } catch (error) {
          const errorMessage = 'An unexpected error occurred during login';
          set({
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            error: errorMessage
          });
          
          return { success: false, error: errorMessage };
        }
      },

      // Register action
      register: async (userData: RegisterData): Promise<AuthResult> => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await registerUser(userData);
          
          if (result.success && result.user) {
            set({
              isAuthenticated: true,
              currentUser: result.user,
              isLoading: false,
              error: null
            });

            // Refresh profile stats for new user
            try {
              await get().refreshProfileStats();
            } catch (error) {
              console.error('Error refreshing profile stats:', error);
            }
          } else {
            set({
              isAuthenticated: false,
              currentUser: null,
              isLoading: false,
              error: result.error || 'Registration failed'
            });
          }
          
          return result;
        } catch (error) {
          const errorMessage = 'An unexpected error occurred during registration';
          set({
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            error: errorMessage
          });
          
          return { success: false, error: errorMessage };
        }
      },

      // Logout action
      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          isLoading: false,
          error: null,
          profileStats: null
        });
      },

      // Clear error action
      clearError: () => {
        set({ error: null });
      },

      // Check authentication status
      checkAuthStatus: async () => {
        const { currentUser } = get();
        
        if (currentUser) {
          set({ isLoading: true });
          
          try {
            // Verify user still exists in database
            const user = await getUserById(currentUser.id);
            
            if (user) {
              set({
                isAuthenticated: true,
                currentUser: user,
                isLoading: false,
                error: null
              });

            // Refresh profile stats
            try {
              await get().refreshProfileStats();
            } catch (error) {
              console.error('Error refreshing profile stats:', error);
            }
            } else {
              // User no longer exists, logout
              set({
                isAuthenticated: false,
                currentUser: null,
                isLoading: false,
                error: null
              });
            }
          } catch (error) {
            console.error('Error checking auth status:', error);
            // On error, logout for security
            set({
              isAuthenticated: false,
              currentUser: null,
              isLoading: false,
              error: null
            });
          }
        } else {
          set({
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            error: null
          });
        }
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Update user data
      updateUser: (user: User) => {
        set({ currentUser: user });
      },

      // Profile Management Actions
      updateProfile: async (data: ProfileUpdateData): Promise<ProfileResult> => {
        const { currentUser } = get();
        if (!currentUser) {
          return { success: false, error: 'User not authenticated' };
        }

        set({ isLoading: true, error: null });

        try {
          // Import the function dynamically to avoid circular dependency
          const { updateUserProfile } = await import('../lib/profile');
          const result = await updateUserProfile(currentUser.id, data);

          if (result.success && result.user) {
            set({
              currentUser: result.user,
              isLoading: false,
              error: null
            });

            // Refresh profile stats
            await get().refreshProfileStats();
          } else {
            set({
              isLoading: false,
              error: result.error || 'Failed to update profile'
            });
          }

          return result;
        } catch (error) {
          const errorMessage = 'An unexpected error occurred while updating profile';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      changePassword: async (data: PasswordChangeData): Promise<ProfileResult> => {
        const { currentUser } = get();
        if (!currentUser) {
          return { success: false, error: 'User not authenticated' };
        }

        set({ isLoading: true, error: null });

        try {
          // Import the function dynamically to avoid circular dependency
          const { changeUserPassword } = await import('../lib/profile');
          const result = await changeUserPassword(currentUser.id, data);

          if (result.success && result.user) {
            set({
              currentUser: result.user,
              isLoading: false,
              error: null
            });
          } else {
            set({
              isLoading: false,
              error: result.error || 'Failed to change password'
            });
          }

          return result;
        } catch (error) {
          const errorMessage = 'An unexpected error occurred while changing password';
          set({
            isLoading: false,
            error: errorMessage
          });
          return { success: false, error: errorMessage };
        }
      },

      refreshProfileStats: async (): Promise<void> => {
        const { currentUser } = get();
        if (!currentUser) return;

        try {
          // Import the function dynamically to avoid circular dependency
          const { getUserProfileStats } = await import('../lib/profile');
          const stats = await getUserProfileStats(currentUser.id);
          set({ profileStats: stats });
        } catch (error) {
          console.error('Error refreshing profile stats:', error);
        }
      }
    }),
    {
      name: 'auth-storage', // Storage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential data
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        profileStats: state.profileStats
      }),
      // Handle rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reset loading and error states on rehydration
          state.isLoading = false;
          state.error = null;
        }
      }
    }
  )
);

// Selectors for easier access to specific state parts
export const useAuth = () => {
  const store = useAuthStore();
  return {
    isAuthenticated: store.isAuthenticated,
    currentUser: store.currentUser,
    isLoading: store.isLoading,
    error: store.error,
    profileStats: store.profileStats
  };
};

export const useAuthActions = () => {
  const store = useAuthStore();
  return {
    login: store.login,
    register: store.register,
    logout: store.logout,
    clearError: store.clearError,
    checkAuthStatus: store.checkAuthStatus,
    setLoading: store.setLoading,
    updateUser: store.updateUser,
    updateProfile: store.updateProfile,
    changePassword: store.changePassword,
    refreshProfileStats: store.refreshProfileStats
  };
};
