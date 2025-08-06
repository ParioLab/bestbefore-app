/**
 * @file src/hooks/useCategories.ts
 * @description
 * Hook for managing user-specific categories with CRUD operations.
 * Provides methods to fetch, add, update, and delete categories.
 *
 * @dependencies
 * - supabaseClient: For database operations
 * - useAuth: To get current user ID
 */

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all categories for the current user
   */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      if (!user) {
        setCategories([]);
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

      if (error) {
        console.error('fetchCategories error:', error);
        throw error;
      }

      setCategories(data || []);
    } catch (err) {
      console.error('fetchCategories exception:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new category
   */
  const addCategory = async (name: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .insert({ name: name.trim(), user_id: user.id });

      if (error) {
        console.error('addCategory error:', error);
        throw error;
      }

      await fetchCategories();
    } catch (err) {
      console.error('addCategory exception:', err);
      throw err;
    }
  };

  /**
   * Update an existing category
   */
  const updateCategory = async (id: string, name: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: name.trim() })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('updateCategory error:', error);
        throw error;
      }

      await fetchCategories();
    } catch (err) {
      console.error('updateCategory exception:', err);
      throw err;
    }
  };

  /**
   * Delete a category
   */
  const deleteCategory = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('deleteCategory error:', error);
        throw error;
      }

      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('deleteCategory exception:', err);
      throw err;
    }
  };

  // Fetch categories on mount or when user changes
  useEffect(() => {
    if (user) {
      fetchCategories().catch(console.error);
    }
  }, [user]);

  return {
    categories,
    loading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
} 