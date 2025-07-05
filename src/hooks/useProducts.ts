/**
 * @file src/hooks/useProducts.ts
 * @description
 * A hook wrapping the ProductContext to provide UI-facing products
 * in the same shape as the mockProducts, with a fallback until
 * real data arrives.
 *
 * @dependencies
 * - ProductContext: raw Supabase CRUD operations
 * - mockProducts: fallback UI data
 */

import { useProducts as useProductsContext, Product as ContextProduct } from '../context/ProductContext';
import { ImageSourcePropType } from 'react-native';
import { mockProducts } from '../data/mockProducts';

// Map of barcode→image to mirror mock assets
const imageMapping: Record<string, ImageSourcePropType> = {
  '1234567890': require('../../assets/images/milk.png'),
  '0987654321': require('../../assets/images/eggs.png'),
  '1122334455': require('../../assets/images/cheese.png'),
  '6677889900': require('../../assets/images/yogurt.png'),
  '5544332211': require('../../assets/images/butter.png'),
};

/**
 * UI-facing product type matching ProductCard
 */
export interface Product {
  id: string;
  name: string;
  expiryDate: string;
  image: ImageSourcePropType;
  barcode: string;
  storageLocation: string;
  details: string;
  nutrition_grade?: string;
  healthBadges?: string[];
  healthTips?: string[];
}

/**
 * Maps a raw ContextProduct to the UI Product shape.
 * Unknown barcodes default to milk image.
 */
function mapToUIProduct(p: ContextProduct): Product {
  const image = p.barcode && imageMapping[p.barcode] ? imageMapping[p.barcode] : require('../../assets/images/milk.png');
  return {
    id: p.id,
    name: p.name,
    expiryDate: p.expiry_date,
    image,
    barcode: p.barcode ?? '',
    storageLocation: p.storage_location,
    details: p.details ?? '',
    nutrition_grade: p.nutrition_grade,
    healthBadges: p.badges ?? [],
    healthTips: p.health_tips ?? [],
  };
}

/**
 * Custom hook returning:
 *  - products: UI-friendly list
 *  - loading: fetch status
 *  - fetch/add/update/delete from context
 */
export function useProducts() {
  const context = useProductsContext();

  // Use fetched data if available, else fallback
  const products = !context.loading && context.products.length > 0
    ? context.products.map(mapToUIProduct)
    : mockProducts;

  return {
    ...context,
    products,
  };
}