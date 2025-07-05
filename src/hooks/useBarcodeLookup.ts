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
  badges?: string[]; // Health badges
  expirationDate?: string; // ISO date string if available
  nutritionGrade?: string; // Add nutrition grade
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
   * Helper to determine health badges based on nutrient values and nova group.
   */
  function getHealthBadges(nutriments: any, novaGroup?: number): string[] {
    const badges: string[] = [];

    // High Fiber
    if (nutriments?.fiber_value >= 3) {
      badges.push('High Fiber');
    }

    // Moderate Salt (100–400 mg)
    if (
      typeof nutriments?.salt_value === 'number' &&
      nutriments.salt_value >= 100 &&
      nutriments.salt_value <= 400
    ) {
      badges.push('Moderate Salt');
    }

    // Ultra-Processed
    if (novaGroup === 4) {
      badges.push('Ultra-Processed');
    }

    // Low Sugar (<= 5g)
    if (typeof nutriments?.sugars_value === 'number' && nutriments.sugars_value <= 5) {
      badges.push('Low Sugar');
    }

    // High Protein (>= 5g)
    if (typeof nutriments?.proteins_value === 'number' && nutriments.proteins_value >= 5) {
      badges.push('High Protein');
    }

    // Low Saturated Fat (<= 1.5g)
    if (typeof nutriments?.['saturated-fat_value'] === 'number' && nutriments['saturated-fat_value'] <= 1.5) {
      badges.push('Low Saturated Fat');
    }

    // Low Calories (<= 40 kcal)
    if (typeof nutriments?.['energy-kcal_value'] === 'number' && nutriments['energy-kcal_value'] <= 40) {
      badges.push('Low Calories');
    }

    // High Calcium (>= 100mg)
    if (typeof nutriments?.calcium_value === 'number' && nutriments.calcium_value >= 100) {
      badges.push('High Calcium');
    }

    // High Iron (>= 2mg)
    if (typeof nutriments?.iron_value === 'number' && nutriments.iron_value >= 2) {
      badges.push('High Iron');
    }

    // High Potassium (>= 300mg)
    if (typeof nutriments?.potassium_value === 'number' && nutriments.potassium_value >= 300) {
      badges.push('High Potassium');
    }

    // Low Cholesterol (<= 20mg)
    if (typeof nutriments?.cholesterol_value === 'number' && nutriments.cholesterol_value <= 20) {
      badges.push('Low Cholesterol');
    }

    return badges;
  }

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
        `https://world.openfoodfacts.net/api/v2/product/${encodeURIComponent(barcode)}?fields=product_name,nutriscore_data,nutriments,nutrition_grades,expiration_date`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }
      const json = await response.json();

      if (json.status === 1 && json.product) {
        const product = json.product;
        const nutriments = product.nutriments;
        const novaGroup = product['nova-group'];
        const badges = getHealthBadges(nutriments, novaGroup);
        const result: FoodProduct = {
          productName: product.product_name || '',
          categories: [], // v2 API does not return categories_tags by default
          imageUrl: undefined, // Not included in v2 fields requested
          brands: undefined, // Not included in v2 fields requested
          badges,
          expirationDate: product.expiration_date || undefined,
          nutritionGrade: product.nutrition_grades || product.nutriscore_data?.grade || undefined, // Extract nutrition grade
        };
        // Optionally, you can extend FoodProduct and BarcodeLookupResult to include more fields from v2 (nutriscore, nutriments, etc.)
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