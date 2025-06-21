import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FeedbackDatabaseService } from '@/services/feedbackDatabase';
import { Feedback, CreateFeedbackInput, UpdateFeedbackInput } from '@/types/database';

// State interface
interface FeedbackState {
  feedback: Feedback[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type FeedbackAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FEEDBACK'; payload: Feedback[] }
  | { type: 'ADD_FEEDBACK'; payload: Feedback }
  | { type: 'UPDATE_FEEDBACK'; payload: Feedback }
  | { type: 'DELETE_FEEDBACK'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'CLEAR_FEEDBACK' };

// Initial state
const initialState: FeedbackState = {
  feedback: [],
  isLoading: false,
  error: null,
};

// Reducer
function feedbackReducer(state: FeedbackState, action: FeedbackAction): FeedbackState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_FEEDBACK':
      return { ...state, feedback: action.payload, isLoading: false };
    case 'ADD_FEEDBACK':
      return { ...state, feedback: [action.payload, ...state.feedback] };
    case 'UPDATE_FEEDBACK':
      return {
        ...state,
        feedback: state.feedback.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_FEEDBACK':
      return {
        ...state,
        feedback: state.feedback.filter(item => item.id !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_FEEDBACK':
      return { ...state, feedback: [] };
    default:
      return state;
  }
}

// Context type
interface FeedbackContextType extends FeedbackState {
  loadUserFeedback: (userId: number) => Promise<void>;
  createFeedback: (feedbackData: CreateFeedbackInput) => Promise<boolean>;
  updateFeedback: (feedbackId: number, updateData: UpdateFeedbackInput) => Promise<boolean>;
  deleteFeedback: (feedbackId: number) => Promise<boolean>;
  markAsReviewed: (feedbackId: number) => Promise<boolean>;
  markAsResolved: (feedbackId: number) => Promise<boolean>;
  getPendingFeedback: () => Feedback[];
  getReviewedFeedback: () => Feedback[];
  getResolvedFeedback: () => Feedback[];
  clearError: () => void;
  refreshFeedback: (userId: number) => Promise<void>;
}

// Create context
const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Provider component
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(feedbackReducer, initialState);

  const loadUserFeedback = async (userId: number): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await FeedbackDatabaseService.getUserFeedback(userId);
      
      if (result.success && result.data) {
        dispatch({ type: 'SET_FEEDBACK', payload: result.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to load feedback' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while loading feedback' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createFeedback = async (feedbackData: CreateFeedbackInput): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await FeedbackDatabaseService.createFeedback(feedbackData);
      
      if (result.success && result.data) {
        dispatch({ type: 'ADD_FEEDBACK', payload: result.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to create feedback' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while creating feedback' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateFeedback = async (feedbackId: number, updateData: UpdateFeedbackInput): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await FeedbackDatabaseService.updateFeedback(feedbackId, updateData);
      
      if (result.success && result.data) {
        dispatch({ type: 'UPDATE_FEEDBACK', payload: result.data });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to update feedback' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while updating feedback' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteFeedback = async (feedbackId: number): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const result = await FeedbackDatabaseService.deleteFeedback(feedbackId);
      
      if (result.success) {
        dispatch({ type: 'DELETE_FEEDBACK', payload: feedbackId });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error?.message || 'Failed to delete feedback' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'An unexpected error occurred while deleting feedback' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markAsReviewed = async (feedbackId: number): Promise<boolean> => {
    return updateFeedback(feedbackId, { status: 'reviewed' });
  };

  const markAsResolved = async (feedbackId: number): Promise<boolean> => {
    return updateFeedback(feedbackId, { status: 'resolved' });
  };

  const getPendingFeedback = (): Feedback[] => {
    return state.feedback.filter(item => item.status === 'pending');
  };

  const getReviewedFeedback = (): Feedback[] => {
    return state.feedback.filter(item => item.status === 'reviewed');
  };

  const getResolvedFeedback = (): Feedback[] => {
    return state.feedback.filter(item => item.status === 'resolved');
  };

  const refreshFeedback = async (userId: number): Promise<void> => {
    await loadUserFeedback(userId);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: FeedbackContextType = {
    ...state,
    loadUserFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback,
    markAsReviewed,
    markAsResolved,
    getPendingFeedback,
    getReviewedFeedback,
    getResolvedFeedback,
    clearError,
    refreshFeedback,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
}

// Hook to use the context
export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}
