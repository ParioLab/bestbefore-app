// File: /Users/georgeoboh/Documents/code/bestbefore-app-project/src/context/ProductContext.tsx

/**
 * @file src/context/ProductContext.tsx
 * @description
 * Provides product state management with offline sync support.
 * Integrates a local AsyncStorage queue to record actions while offline,
 * then replays them against Supabase when connectivity returns.
 *
 * Also registers for push notifications and schedules expiry reminders
 * for each product when the product list is loaded.
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase client for database operations
 * - AsyncStorage queue via useSyncQueue
 * - useAuth: To retrieve current user ID
 * - useNotifications: To register for and schedule push notifications
 */

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';
import { useSyncQueue } from '../hooks/useSyncQueue';
import { useNotifications } from '../hooks/useNotifications';

export interface Product {
  id: string;
  name: string;
  barcode: string | null;
  expiry_date: string; // YYYY-MM-DD
  category: string;
  storage_location: string;
  details: string | null;
  created_at: string;
  badges?: string[];
  health_tips?: string[];
}

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (data: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (
    id: string,
    updates: Partial<Omit<Product, 'id' | 'created_at'>>
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { enqueueAction, syncQueue } = useSyncQueue();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Notification hook for scheduling reminders
  const { registerForPushNotificationsAsync, scheduleNotificationsForProduct } = useNotifications();

  /**
   * Fetch all products for current user, after running any queued actions.
   * Then schedules push notifications for each item.
   */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (!user) {
        setProducts([]);
        return;
      }
      // Replay any offline actions first
      await syncQueue();

      // Fetch fresh data from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('expiry_date', { ascending: true });

      if (error) {
        console.error('fetchProducts error:', error);
        throw error;
      }
      // Update state
      setProducts(data);

      // Schedule notifications for each product
      data.forEach((p) =>
        scheduleNotificationsForProduct({
          id: p.id,
          name: p.name,
          expiry_date: p.expiry_date,
        })
      );
    } catch (err) {
      console.error('fetchProducts exception:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new product: enqueue for offline, attempt online, then refresh.
   */
  const addProduct = async (data: Omit<Product, 'id' | 'created_at'>) => {
    if (!user) return;
    await enqueueAction('ADD', data);
    const { error } = await supabase
      .from('products')
      .insert({ ...data, user_id: user.id });
    if (error) {
      console.warn('addProduct: offline or error, action queued', error);
    }
    await fetchProducts();
  };

  /**
   * Update an existing product: enqueue, attempt online, then refresh.
   */
  const updateProduct = async (
    id: string,
    updates: Partial<Omit<Product, 'id' | 'created_at'>>
  ) => {
    if (!user) return;
    await enqueueAction('EDIT', { id, updates });
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      console.warn('updateProduct: offline or error, action queued', error);
    }
    await fetchProducts();
  };

  /**
   * Delete a product: enqueue, attempt online, then update state.
   */
  const deleteProduct = async (id: string) => {
    if (!user) return;
    await enqueueAction('DELETE', { id });
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) {
      console.warn('deleteProduct: offline or error, action queued', error);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // On mount or when user changes:
  // 1) register for push notifications
  // 2) fetch products (which also schedules reminders)
  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().catch(console.error);
      fetchProducts().catch(console.error);
    }
  }, [user]);

  return (
    <ProductContext.Provider
      value={{ products, loading, fetchProducts, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};