/**
 * @file src/hooks/useCategoryReminders.ts
 * @description
 * Hook for managing category-specific reminder frequency settings.
 * Provides methods to fetch, add, update, and delete category reminder settings.
 *
 * @dependencies
 * - supabaseClient: For database operations
 * - useAuth: To get current user ID
 */

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

export interface CategoryReminder {
  id: string;
  category_name: string;
  reminder_days: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryReminderContextType {
  categoryReminders: CategoryReminder[];
  loading: boolean;
  fetchCategoryReminders: () => Promise<void>;
  addCategoryReminder: (categoryName: string, reminderDays: number) => Promise<void>;
  updateCategoryReminder: (id: string, reminderDays: number) => Promise<void>;
  deleteCategoryReminder: (id: string) => Promise<void>;
  getReminderForCategory: (categoryName: string) => number;
}

export function useCategoryReminders() {
  const { user } = useAuth();
  const [categoryReminders, setCategoryReminders] = useState<CategoryReminder[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all category reminders for the current user
   */
  const fetchCategoryReminders = async () => {
    setLoading(true);
    try {
      if (!user) {
        setCategoryReminders([]);
        return;
      }

      const { data, error } = await supabase
        .from('category_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('category_name', { ascending: true });

      if (error) {
        console.error('fetchCategoryReminders error:', error);
        throw error;
      }

      setCategoryReminders(data || []);
    } catch (err) {
      console.error('fetchCategoryReminders exception:', err);
      setCategoryReminders([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new category reminder
   */
  const addCategoryReminder = async (categoryName: string, reminderDays: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('category_reminders')
        .insert({ 
          category_name: categoryName.trim(), 
          reminder_days: reminderDays,
          user_id: user.id 
        });

      if (error) {
        console.error('addCategoryReminder error:', error);
        throw error;
      }

      await fetchCategoryReminders();
    } catch (err) {
      console.error('addCategoryReminder exception:', err);
      throw err;
    }
  };

  /**
   * Update an existing category reminder
   */
  const updateCategoryReminder = async (id: string, reminderDays: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('category_reminders')
        .update({ reminder_days: reminderDays })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('updateCategoryReminder error:', error);
        throw error;
      }

      await fetchCategoryReminders();
    } catch (err) {
      console.error('updateCategoryReminder exception:', err);
      throw err;
    }
  };

  /**
   * Delete a category reminder
   */
  const deleteCategoryReminder = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('category_reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('deleteCategoryReminder error:', error);
        throw error;
      }

      setCategoryReminders(prev => prev.filter(reminder => reminder.id !== id));
    } catch (err) {
      console.error('deleteCategoryReminder exception:', err);
      throw err;
    }
  };

  /**
   * Get reminder days for a specific category
   */
  const getReminderForCategory = (categoryName: string): number => {
    const reminder = categoryReminders.find(r => r.category_name === categoryName);
    return reminder?.reminder_days || 3; // Default to 3 days if not found
  };

  // Fetch category reminders on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchCategoryReminders().catch(console.error);
    }
  }, [user]);

  return {
    categoryReminders,
    loading,
    fetchCategoryReminders,
    addCategoryReminder,
    updateCategoryReminder,
    deleteCategoryReminder,
    getReminderForCategory,
  };
} 