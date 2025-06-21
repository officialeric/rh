import DatabaseService from './database';
import { 
  DbFeedback, 
  CreateFeedbackInput, 
  UpdateFeedbackInput, 
  DatabaseResult,
  Feedback 
} from '@/types/database';

// Convert database feedback to app feedback
const dbFeedbackToFeedback = (dbFeedback: DbFeedback): Feedback => ({
  id: dbFeedback.id,
  userId: dbFeedback.userId,
  subject: dbFeedback.subject,
  message: dbFeedback.message,
  status: dbFeedback.status,
  createdAt: dbFeedback.createdAt,
  updatedAt: dbFeedback.updatedAt
});

export class FeedbackDatabaseService {
  private static db = DatabaseService.getInstance();

  // Create new feedback
  static async createFeedback(feedbackData: CreateFeedbackInput): Promise<DatabaseResult<Feedback>> {
    try {
      const now = new Date().toISOString();

      const result = await this.db.runStatement(
        `INSERT INTO feedback (userId, subject, message, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          feedbackData.userId,
          feedbackData.subject,
          feedbackData.message,
          'pending',
          now,
          now
        ]
      );

      const newFeedback = await this.db.getFirstRow<DbFeedback>(
        'SELECT * FROM feedback WHERE id = ?',
        [result.lastInsertRowId]
      );

      if (!newFeedback) {
        return {
          success: false,
          error: {
            code: 'FEEDBACK_CREATION_FAILED',
            message: 'Failed to create feedback.'
          }
        };
      }

      return {
        success: true,
        data: dbFeedbackToFeedback(newFeedback)
      };
    } catch (error) {
      console.error('Error creating feedback:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to create feedback.',
          details: error
        }
      };
    }
  }

  // Get feedback by ID
  static async getFeedbackById(feedbackId: number): Promise<DatabaseResult<Feedback>> {
    try {
      const feedback = await this.db.getFirstRow<DbFeedback>(
        'SELECT * FROM feedback WHERE id = ?',
        [feedbackId]
      );

      if (!feedback) {
        return {
          success: false,
          error: {
            code: 'FEEDBACK_NOT_FOUND',
            message: 'Feedback not found.'
          }
        };
      }

      return {
        success: true,
        data: dbFeedbackToFeedback(feedback)
      };
    } catch (error) {
      console.error('Error getting feedback by ID:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve feedback.',
          details: error
        }
      };
    }
  }

  // Get all feedback for a user
  static async getUserFeedback(userId: number): Promise<DatabaseResult<Feedback[]>> {
    try {
      const feedback = await this.db.runQuery<DbFeedback>(
        'SELECT * FROM feedback WHERE userId = ? ORDER BY createdAt DESC',
        [userId]
      );

      return {
        success: true,
        data: feedback.map(dbFeedbackToFeedback)
      };
    } catch (error) {
      console.error('Error getting user feedback:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve feedback.',
          details: error
        }
      };
    }
  }

  // Get feedback by status
  static async getFeedbackByStatus(status: 'pending' | 'reviewed' | 'resolved'): Promise<DatabaseResult<Feedback[]>> {
    try {
      const feedback = await this.db.runQuery<DbFeedback>(
        'SELECT * FROM feedback WHERE status = ? ORDER BY createdAt DESC',
        [status]
      );

      return {
        success: true,
        data: feedback.map(dbFeedbackToFeedback)
      };
    } catch (error) {
      console.error('Error getting feedback by status:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve feedback.',
          details: error
        }
      };
    }
  }

  // Get user feedback by status
  static async getUserFeedbackByStatus(userId: number, status: 'pending' | 'reviewed' | 'resolved'): Promise<DatabaseResult<Feedback[]>> {
    try {
      const feedback = await this.db.runQuery<DbFeedback>(
        'SELECT * FROM feedback WHERE userId = ? AND status = ? ORDER BY createdAt DESC',
        [userId, status]
      );

      return {
        success: true,
        data: feedback.map(dbFeedbackToFeedback)
      };
    } catch (error) {
      console.error('Error getting user feedback by status:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve feedback.',
          details: error
        }
      };
    }
  }

  // Update feedback
  static async updateFeedback(feedbackId: number, updateData: UpdateFeedbackInput): Promise<DatabaseResult<Feedback>> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      // Build dynamic update query
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      });

      if (updates.length === 0) {
        return {
          success: false,
          error: {
            code: 'NO_UPDATES',
            message: 'No updates provided.'
          }
        };
      }

      // Add updatedAt timestamp
      updates.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(feedbackId);

      await this.db.runStatement(
        `UPDATE feedback SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      // Get updated feedback
      const updatedFeedback = await this.getFeedbackById(feedbackId);
      return updatedFeedback;
    } catch (error) {
      console.error('Error updating feedback:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to update feedback.',
          details: error
        }
      };
    }
  }

  // Delete feedback
  static async deleteFeedback(feedbackId: number): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.db.runStatement(
        'DELETE FROM feedback WHERE id = ?',
        [feedbackId]
      );

      return {
        success: result.changes > 0,
        data: result.changes > 0
      };
    } catch (error) {
      console.error('Error deleting feedback:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to delete feedback.',
          details: error
        }
      };
    }
  }

  // Mark feedback as reviewed
  static async markAsReviewed(feedbackId: number): Promise<DatabaseResult<Feedback>> {
    return this.updateFeedback(feedbackId, { status: 'reviewed' });
  }

  // Mark feedback as resolved
  static async markAsResolved(feedbackId: number): Promise<DatabaseResult<Feedback>> {
    return this.updateFeedback(feedbackId, { status: 'resolved' });
  }

  // Get all feedback (for admin purposes)
  static async getAllFeedback(): Promise<DatabaseResult<Feedback[]>> {
    try {
      const feedback = await this.db.runQuery<DbFeedback>(
        'SELECT * FROM feedback ORDER BY createdAt DESC'
      );

      return {
        success: true,
        data: feedback.map(dbFeedbackToFeedback)
      };
    } catch (error) {
      console.error('Error getting all feedback:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve feedback.',
          details: error
        }
      };
    }
  }

  // Get feedback statistics
  static async getFeedbackStats(): Promise<DatabaseResult<any>> {
    try {
      const stats = await this.db.getFirstRow<any>(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) as reviewed,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
         FROM feedback`
      );

      return {
        success: true,
        data: {
          total: stats?.total || 0,
          pending: stats?.pending || 0,
          reviewed: stats?.reviewed || 0,
          resolved: stats?.resolved || 0
        }
      };
    } catch (error) {
      console.error('Error getting feedback stats:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to retrieve feedback statistics.',
          details: error
        }
      };
    }
  }

  // Delete all feedback for a user
  static async deleteUserFeedback(userId: number): Promise<DatabaseResult<boolean>> {
    try {
      const result = await this.db.runStatement(
        'DELETE FROM feedback WHERE userId = ?',
        [userId]
      );

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Error deleting user feedback:', error);
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to delete feedback.',
          details: error
        }
      };
    }
  }
}
