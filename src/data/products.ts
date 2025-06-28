import { createClient } from '@supabase/supabase-js';
import type { Product } from '../context/ProductContext';

// Use environment variables for E2E and Node tests
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function fetchProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('expiry_date', { ascending: true });
  if (error) throw error;
  return data as Product[];
}

export async function addProduct(userId: string, data: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const { data: result, error } = await supabase
    .from('products')
    .insert({ ...data, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return result as Product;
}

export async function updateProduct(
  userId: string,
  id: string,
  updates: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(userId: string, id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
} 