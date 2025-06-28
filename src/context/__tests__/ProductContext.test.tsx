import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { ProductProvider, ProductContext } from '../ProductContext';
import { useAuth } from '../AuthContext';
import { supabase } from '../../utils/supabaseClient';

jest.mock('../AuthContext');
jest.mock('../../utils/supabaseClient');

const mockUser = { id: 'user-1' };

const mockProduct = {
  name: 'Test Product',
  barcode: '111222333',
  expiry_date: '2024-12-31',
  category: 'Dairy',
  storage_location: 'Fridge',
  details: 'Test details',
};

describe('ProductContext', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    // Mock the query builder chain for supabase.from
    const queryBuilder: any = {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    };
    (supabase.from as jest.Mock).mockImplementation(() => queryBuilder);
  });

  it('adds a product', async () => {
    const queryBuilder: any = supabase.from('products');
    (queryBuilder.insert as jest.Mock).mockResolvedValue({ error: null });
    (queryBuilder.select as jest.Mock).mockResolvedValue({ data: [mockProduct], error: null });
    const wrapper = ({ children }: any) => <ProductProvider>{children}</ProductProvider>;
    const { result } = renderHook(() => React.useContext(ProductContext), { wrapper });
    await act(async () => {
      await result.current!.addProduct(mockProduct);
    });
    expect(supabase.from).toHaveBeenCalledWith('products');
    expect(queryBuilder.insert).toHaveBeenCalledWith({ ...mockProduct, user_id: mockUser.id });
  });

  it('updates a product', async () => {
    const queryBuilder: any = supabase.from('products');
    (queryBuilder.update as jest.Mock).mockResolvedValue({ error: null });
    (queryBuilder.select as jest.Mock).mockResolvedValue({ data: [mockProduct], error: null });
    const wrapper = ({ children }: any) => <ProductProvider>{children}</ProductProvider>;
    const { result } = renderHook(() => React.useContext(ProductContext), { wrapper });
    await act(async () => {
      await result.current!.updateProduct('product-1', { name: 'Updated' });
    });
    expect(queryBuilder.update).toHaveBeenCalledWith({ name: 'Updated' });
    expect(queryBuilder.eq).toHaveBeenCalledWith('id', 'product-1');
  });

  it('deletes a product', async () => {
    const queryBuilder: any = supabase.from('products');
    (queryBuilder.delete as jest.Mock).mockResolvedValue({ error: null });
    const wrapper = ({ children }: any) => <ProductProvider>{children}</ProductProvider>;
    const { result } = renderHook(() => React.useContext(ProductContext), { wrapper });
    await act(async () => {
      await result.current!.deleteProduct('product-1');
    });
    expect(queryBuilder.delete).toHaveBeenCalled();
    expect(queryBuilder.eq).toHaveBeenCalledWith('id', 'product-1');
  });
}); 