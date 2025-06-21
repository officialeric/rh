import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { 
  User, 
  AuthState, 
  LoginCredentials, 
  RegisterData, 
  UserUpdateData, 
  UserStats 
} from '@/types/user';
import { UserService } from '@/services/userService';

// Action types
type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// Reducer
function userReducer(state: AuthState, action: UserAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

// Context type
interface UserContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updateData: UserUpdateData) => Promise<boolean>;
  getUserStats: () => Promise<UserStats | null>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Initialize user state on app start
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const isAuth = await UserService.isAuthenticated();
      if (isAuth) {
        const user = await UserService.getCurrentUser();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        } else {
          // Clear invalid auth state
          await UserService.logout();
          dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        }
      } else {
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize user session' });
      dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await UserService.login(credentials);
      
      if (response.success && response.user) {
        dispatch({ type: 'SET_USER', payload: response.user });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Login failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred during login' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await UserService.register(userData);
      
      if (response.success && response.user) {
        dispatch({ type: 'SET_USER', payload: response.user });
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Registration failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred during registration' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await UserService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear the state even if logout fails
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (updateData: UserUpdateData): Promise<boolean> => {
    if (!state.user) {
      dispatch({ type: 'SET_ERROR', payload: 'No user logged in' });
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await UserService.updateProfile(state.user.id, updateData);
      
      if (response.success && response.user) {
        dispatch({ type: 'SET_USER', payload: response.user });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Profile update failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred during profile update' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getUserStats = async (): Promise<UserStats | null> => {
    if (!state.user) {
      return null;
    }

    try {
      return await UserService.getUserStats(state.user.id);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!state.isAuthenticated) return;

    try {
      const user = await UserService.getCurrentUser();
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: UserContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    getUserStats,
    clearError,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
