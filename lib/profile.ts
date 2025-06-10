import { getDatabase, User } from './database';
import { verifyPassword, hashPassword, validateEmail } from './auth';

// Profile update interfaces
export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface ProfileStats {
  totalReminders: number;
  completedReminders: number;
  pendingReminders: number;
  completionRate: number;
}

// Calculate profile completion score
export const calculateProfileCompletion = (user: User): number => {
  let score = 0;
  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.phone,
    user.bio,
    user.profilePicture
  ];
  
  fields.forEach(field => {
    if (field && field.trim()) {
      score += Math.round(100 / fields.length);
    }
  });
  
  return Math.min(score, 100);
};

// Validate profile update data
export const validateProfileData = (data: ProfileUpdateData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (data.firstName !== undefined) {
    if (!data.firstName.trim()) {
      errors.push('First name is required');
    } else if (data.firstName.length > 50) {
      errors.push('First name must be less than 50 characters');
    }
  }
  
  if (data.lastName !== undefined) {
    if (!data.lastName.trim()) {
      errors.push('Last name is required');
    } else if (data.lastName.length > 50) {
      errors.push('Last name must be less than 50 characters');
    }
  }
  
  if (data.email !== undefined) {
    if (!data.email.trim()) {
      errors.push('Email is required');
    } else if (!validateEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }
  }
  
  if (data.phone !== undefined && data.phone.trim()) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }
  }
  
  if (data.bio !== undefined && data.bio.length > 500) {
    errors.push('Bio must be less than 500 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Update user profile
export const updateUserProfile = async (userId: number, data: ProfileUpdateData): Promise<ProfileResult> => {
  try {
    console.log('Updating profile for user:', userId, data);
    
    // Validate input data
    const validation = validateProfileData(data);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join('. ') };
    }
    
    const db = await getDatabase();
    
    // Check if email is being updated and if it's unique
    if (data.email) {
      const existingUser = await db.getFirstAsync<any>(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [data.email.toLowerCase(), userId]
      );
      
      if (existingUser) {
        return { success: false, error: 'Email address is already in use' };
      }
    }
    
    // Build dynamic update query
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(key === 'email' ? value.toLowerCase() : value);
      }
    });
    
    if (updateFields.length === 0) {
      return { success: false, error: 'No fields to update' };
    }
    
    // Add updated timestamp
    updateFields.push('updatedAt = CURRENT_TIMESTAMP');
    updateValues.push(userId);
    
    // Execute update
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.runAsync(updateQuery, updateValues);
    
    // Get updated user data
    const updatedUser = await db.getFirstAsync<User>(
      `SELECT id, email, firstName, lastName, phone, bio, profilePicture, 
              profileCompletionScore, lastLoginAt, createdAt, updatedAt 
       FROM users WHERE id = ?`,
      [userId]
    );
    
    if (!updatedUser) {
      return { success: false, error: 'Failed to retrieve updated profile' };
    }
    
    // Update profile completion score
    const completionScore = calculateProfileCompletion(updatedUser);
    await db.runAsync(
      'UPDATE users SET profileCompletionScore = ? WHERE id = ?',
      [completionScore, userId]
    );
    
    // Get final updated user with completion score
    const finalUser = await db.getFirstAsync<User>(
      `SELECT id, email, firstName, lastName, phone, bio, profilePicture, 
              profileCompletionScore, lastLoginAt, createdAt, updatedAt 
       FROM users WHERE id = ?`,
      [userId]
    );
    
    console.log('Profile updated successfully');
    return { success: true, user: finalUser! };
    
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
};

// Change user password
export const changeUserPassword = async (userId: number, passwordData: PasswordChangeData): Promise<ProfileResult> => {
  try {
    console.log('Changing password for user:', userId);
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return { success: false, error: 'New passwords do not match' };
    }
    
    if (passwordData.newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long' };
    }
    
    const db = await getDatabase();
    
    // Get current user data
    const currentUser = await db.getFirstAsync<any>(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    
    if (!currentUser) {
      return { success: false, error: 'User not found' };
    }
    
    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(passwordData.currentPassword, currentUser.password);
    if (!isCurrentPasswordValid) {
      return { success: false, error: 'Current password is incorrect' };
    }
    
    // Hash new password
    const hashedNewPassword = await hashPassword(passwordData.newPassword);
    
    // Update password
    await db.runAsync(
      'UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId]
    );
    
    // Get updated user data (without password)
    const updatedUser = await db.getFirstAsync<User>(
      `SELECT id, email, firstName, lastName, phone, bio, profilePicture, 
              profileCompletionScore, lastLoginAt, createdAt, updatedAt 
       FROM users WHERE id = ?`,
      [userId]
    );
    
    console.log('Password changed successfully');
    return { success: true, user: updatedUser! };
    
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, error: 'Failed to change password' };
  }
};

// Get user profile statistics
export const getUserProfileStats = async (userId: number): Promise<ProfileStats> => {
  try {
    const db = await getDatabase();
    
    // Get reminder statistics
    const stats = await db.getFirstAsync<any>(
      `SELECT 
        COUNT(*) as totalReminders,
        SUM(CASE WHEN isCompleted = 1 THEN 1 ELSE 0 END) as completedReminders,
        SUM(CASE WHEN isCompleted = 0 THEN 1 ELSE 0 END) as pendingReminders
       FROM reminders WHERE userId = ?`,
      [userId]
    );
    
    const totalReminders = stats?.totalReminders || 0;
    const completedReminders = stats?.completedReminders || 0;
    const pendingReminders = stats?.pendingReminders || 0;
    const completionRate = totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0;
    
    return {
      totalReminders,
      completedReminders,
      pendingReminders,
      completionRate
    };
    
  } catch (error) {
    console.error('Error getting profile stats:', error);
    return {
      totalReminders: 0,
      completedReminders: 0,
      pendingReminders: 0,
      completionRate: 0
    };
  }
};

// Update last login time
export const updateLastLogin = async (userId: number): Promise<void> => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE users SET lastLoginAt = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};
