/**
 * @file src/hooks/useBarcodeLookup.ts
 * @description
 * Hook for looking up product information by barcode using the Open Food Facts API.
 * Provides a lookup function and loading/error state.
 *
 * Key features:
 * - Fetches product data for a given barcode
 * - Returns structured product information or error
 *
 * @dependencies
 * - fetch API: to call the Open Food Facts API
 *
 * @notes
 * - Does not require API key
 * - Product may not include all fields; handle missing fields gracefully
 */

import { useState } from 'react';

/** Represents the data returned for a found product */
export interface FoodProduct {
  productName: string;
  categories: string[];
  imageUrl?: string;
  brands?: string;
}

/** Result of attempting to look up a barcode */
export interface BarcodeLookupResult {
  success: boolean;
  data?: FoodProduct;
  error?: string;
}

/**
 * Custom hook to perform barcode lookup using Open Food Facts.
 *
 * @returns An object containing:
 * - lookupBarcode: function to call with a barcode string
 * - loading: boolean indicating ongoing lookup
 * - error: string message if lookup failed
 */
export function useBarcodeLookup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Perform a lookup for the given barcode.
   *
   * @param barcode - The barcode string to lookup
   * @returns A promise resolving to BarcodeLookupResult
   */
  async function lookupBarcode(barcode: string): Promise<BarcodeLookupResult> {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const json = await response.json();

      if (json.status === 1 && json.product) {
        const product = json.product;
        const result: FoodProduct = {
          productName: product.product_name || '',
          categories: product.categories_tags || [],
          imageUrl: product.image_front_small_url || product.image_url || undefined,
          brands: product.brands || undefined,
        };
        return { success: true, data: result };
      } else {
        return { success: false, error: 'Product not found.' };
      }
    } catch (err: any) {
      const message = err.message || 'Unknown error during barcode lookup.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  return { lookupBarcode, loading, error };
}