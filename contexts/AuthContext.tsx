import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { initializeDatabase } from '../lib/database';
import { useAuth, useAuthActions } from '../stores/authStore';

// Auth context interface
interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: any;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();
  const actions = useAuthActions();

  useEffect(() => {
    // Initialize database and check auth status on app start
    const initializeApp = async () => {
      try {
        // Initialize database (will handle schema updates automatically)
        await initializeDatabase();
        console.log('Database initialized successfully');

        // Check authentication status
        await actions.checkAuthStatus();
        console.log('Auth status checked');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  const contextValue: AuthContextType = {
    ...auth,
    ...actions
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Export for convenience
export { useAuth, useAuthActions } from '../stores/authStore';

