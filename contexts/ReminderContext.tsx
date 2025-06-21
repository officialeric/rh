import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ReminderDatabaseService } from '@/services/reminderDatabase';
import { Reminder, CreateReminderInput, UpdateReminderInput } from '@/types/database';

// State interface
interface ReminderState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type ReminderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_REMINDERS' };

// Initial state
const initialState: ReminderState = {
  reminders: [],
  isLoading: false,
  error: null,
};

// Reducer
function reminderReducer(state: ReminderState, action: ReminderAction): ReminderState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload, isLoading: false };
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        )
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_REMINDERS':
      return { ...state, reminders: [] };
    default:
      return state;
  }
}

// Context type
interface ReminderContextType extends ReminderState {
  loadUserReminders: (userId: number) => Promise<void>;
  createReminder: (reminderData: CreateReminderInput) => Promise<boolean>;
  updateReminder: (reminderId: number, updateData: UpdateReminderInput) => Promise<boolean>;
  deleteReminder: (reminderId: number) => Promise<boolean>;
  markAsCompleted: (reminderId: number) => Promise<boolean>;
  markAsPending: (reminderId: number) => Promise<boolean>;
  getPendingReminders: () => Reminder[];
  getCompletedReminders: () => Reminder[];
  getOverdueReminders: () => Reminder[];
  getTodayReminders: () => Reminder[];
  clearError: () => void;
  refreshReminders: (userId: number) => Promise<void>;
}

// Create context
const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

// Provider component
export function ReminderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reminderReducer, initialState);

  const loadUserReminders = async (userId: number): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await ReminderDatabaseService.getUserReminders(userId);
      
      if (result.success && result.data) {
        dispatch({ type: 'SET_REMINDERS', payload: result.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to load reminders' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while loading reminders' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createReminder = async (reminderData: CreateReminderInput): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await ReminderDatabaseService.createReminder(reminderData);
      
      if (result.success && result.data) {
        dispatch({ type: 'ADD_REMINDER', payload: result.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to create reminder' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while creating reminder' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateReminder = async (reminderId: number, updateData: UpdateReminderInput): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await ReminderDatabaseService.updateReminder(reminderId, updateData);
      
      if (result.success && result.data) {
        dispatch({ type: 'UPDATE_REMINDER', payload: result.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to update reminder' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while updating reminder' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteReminder = async (reminderId: number): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await ReminderDatabaseService.deleteReminder(reminderId);
      
      if (result.success) {
        dispatch({ type: 'DELETE_REMINDER', payload: reminderId });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to delete reminder' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while deleting reminder' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markAsCompleted = async (reminderId: number): Promise<boolean> => {
    return updateReminder(reminderId, { isCompleted: true });
  };

  const markAsPending = async (reminderId: number): Promise<boolean> => {
    return updateReminder(reminderId, { isCompleted: false });
  };

  const getPendingReminders = (): Reminder[] => {
    return state.reminders.filter(reminder => !reminder.isCompleted);
  };

  const getCompletedReminders = (): Reminder[] => {
    return state.reminders.filter(reminder => reminder.isCompleted);
  };

  const getOverdueReminders = (): Reminder[] => {
    const today = new Date().toISOString().split('T')[0];
    return state.reminders.filter(reminder => 
      !reminder.isCompleted && reminder.dueDate < today
    );
  };

  const getTodayReminders = (): Reminder[] => {
    const today = new Date().toISOString().split('T')[0];
    return state.reminders.filter(reminder => 
      reminder.dueDate.startsWith(today)
    );
  };

  const refreshReminders = async (userId: number): Promise<void> => {
    await loadUserReminders(userId);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: ReminderContextType = {
    ...state,
    loadUserReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    markAsCompleted,
    markAsPending,
    getPendingReminders,
    getCompletedReminders,
    getOverdueReminders,
    getTodayReminders,
    clearError,
    refreshReminders,
  };

  return (
    <ReminderContext.Provider value={value}>
      {children}
    </ReminderContext.Provider>
  );
}

// Hook to use the context
export function useReminders() {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
}
