import dayjs from 'dayjs';
import { Product } from '../components/ProductCard';

/**
 * Fallback list of products matching the UI Product interface.
 * Used until real Supabase data is available.
 */
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Lactantia Lactose Free Milk',
    expiryDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/milk.png'),
    barcode: '1234567890',
    storageLocation: 'Fridge',
    details:
      "Lactantia Lactose Free Milk delivers the fresh, delicious taste of 100% Canadian milk without the discomfort. Enriched with calcium, protein, and vitamins A and D, it's easy to digest and perfect for the whole family",
  },
  {
    id: '2',
    name: 'Eggs',
    expiryDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/eggs.png'),
    barcode: '0987654321',
    storageLocation: 'Fridge',
    details: 'A dozen large, grade A eggs.',
  },
  {
    id: '3',
    name: 'Cheese',
    expiryDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/cheese.png'),
    barcode: '1122334455',
    storageLocation: 'Fridge',
    details: 'A block of sharp cheddar cheese.',
  },
  {
    id: '4',
    name: 'Yogurt',
    expiryDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/yogurt.png'),
    barcode: '6677889900',
    storageLocation: 'Fridge',
    details: 'A container of plain Greek yogurt.',
  },
  {
    id: '5',
    name: 'Butter',
    expiryDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/butter.png'),
    barcode: '5544332211',
    storageLocation: 'Fridge',
    details: 'A stick of unsalted butter.',
  },
];