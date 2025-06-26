// File: src/context/ProductContext.tsx

/**
 * @file src/context/ProductContext.tsx
 * @description
 * Provides product state management for the BestBefore app.
 * Fetches, adds, updates, and deletes products in Supabase
 * and keeps local state in sync.
 *
 * Key features:
 * - Loads user-specific products from Supabase on mount
 * - Exposes CRUD operations: fetchProducts, addProduct, updateProduct, deleteProduct
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase client for database operations
 * - React: Context API for state management
 * - useAuth: To retrieve current user ID
 *
 * @notes
 * - All operations assume `user` is non-null; ensure user is authenticated first.
 * - Handles errors by throwing; consuming components should catch and display feedback.
 */

import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
  } from 'react';
  import {
    PostgrestError,
  } from '@supabase/supabase-js';
  import { supabase } from '../utils/supabaseClient';
  import { useAuth } from './AuthContext';
  
  /** Shape of a product in the app */
  export interface Product {
    id: string;
    name: string;
    barcode: string | null;
    expiry_date: string; // YYYY-MM-DD
    category: string;
    storage_location: string;
    details: string | null;
    created_at: string;
  }
  
  /** Methods exposed by the product context */
  interface ProductContextType {
    products: Product[];
    loading: boolean;
    fetchProducts: () => Promise<void>;
    addProduct: (data: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
    updateProduct: (
      id: string,
      updates: Partial<Omit<Product, 'id' | 'user_id' | 'created_at'>>
    ) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
  }
  
  /** Create the product context */
  const ProductContext = createContext<ProductContextType | undefined>(
    undefined
  );
  
  /** Provider component for product state */
  export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
  
    /** Fetch all products for the current user */
    const fetchProducts = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('expiry_date', { ascending: true });
      if (error) throw error;
      setProducts(data);
      setLoading(false);
    };
  
    /** Add a new product */
    const addProduct = async (
      data: Omit<Product, 'id' | 'created_at'>
    ) => {
      if (!user) return;
      const payload = { ...data, user_id: user.id };
      const { error } = await supabase.from('products').insert(payload);
      if (error) throw error;
      await fetchProducts();
    };
  
    /** Update an existing product by ID */
    const updateProduct = async (
      id: string,
      updates: Partial<Omit<Product, 'id' | 'created_at'>>
    ) => {
      if (!user) return;
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      await fetchProducts();
    };
  
    /** Delete a product by ID */
    const deleteProduct = async (id: string) => {
      if (!user) return;
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    };
  
    // Load products when user changes
    useEffect(() => {
      fetchProducts().catch(console.error);
    }, [user]);
  
    return (
      <ProductContext.Provider
        value={{
          products,
          loading,
          fetchProducts,
          addProduct,
          updateProduct,
          deleteProduct,
        }}
      >
        {children}
      </ProductContext.Provider>
    );
  };
  
  /**
   * Custom hook to access product context.
   * Throws an error if used outside of ProductProvider.
   */
  export const useProducts = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
      throw new Error(
        'useProducts must be used within a ProductProvider'
      );
    }
    return context;
  };