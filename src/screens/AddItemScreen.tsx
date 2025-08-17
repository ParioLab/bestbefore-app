/**
 * @file src/screens/AddItemScreen.tsx
 * @description
 * Screen for adding a new product or editing an existing one.
 * Presents form fields for product details and handles submission logic.
 *
 * Key features:
 * - Handles both creation and editing modes based on navigation parameters.
 * - Form inputs for name, expiry date, barcode, category, and storage location.
 * - Integrates with product context to perform add or update operations.
 * - Supports custom category creation with user-specific categories.
 *
 * @dependencies
 * - useProducts: Provides addProduct and updateProduct methods.
 * - useCategories: Provides category management functionality.
 * - @react-navigation: For routing and retrieving navigation params.
 *
 * @notes
 * - Validates required fields before submission.
 * - Navigates back upon successful operation.
 * - Allows users to create custom categories.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomTextInput from '../components/CustomTextInput';
import CustomPicker from '../components/CustomPicker';
import CategoryModal from '../components/CategoryModal';
import CalendarPicker from '../components/CalendarPicker';
import BarcodeIcon from '../../assets/images/barcode-icon.svg';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { Product as UIProduct } from '../components/ProductCard';
import { useBarcodeLookup } from '../hooks/useBarcodeLookup';
import dayjs from 'dayjs';

type AddItemNavProp = StackNavigationProp<RootStackParamList, 'AddItem'>;
type AddItemRouteProp = RouteProp<RootStackParamList, 'AddItem'>;

// Badge to tip mapping
const BADGE_TIPS: Record<string, string> = {
  'High Fiber': 'Good source of fiber.',
  'Moderate Salt': 'Contains moderate salt. Monitor your sodium intake.',
  'Ultra-Processed': 'This product is ultra-processed. Try to balance it with whole foods.',
  'Low Sugar': 'Low in sugar. Suitable for low-sugar diets.',
  'High Protein': 'Good source of protein for muscle building.',
  'Low Saturated Fat': 'Low in saturated fat. Heart-healthy choice.',
  'Low Calories': 'Low calorie. Good for weight management.',
  'High Calcium': 'High in calcium. Supports bone health.',
  'High Iron': 'Rich in iron. Supports healthy blood.',
  'High Potassium': 'High in potassium. Supports heart and muscle function.',
  'Low Cholesterol': 'Low in cholesterol. Heart-healthy.',
};

function getHealthTipsFromBadges(badges: string[]): string[] {
  const tips: string[] = [];
  for (const badge of badges) {
    if (BADGE_TIPS[badge]) {
      tips.push(BADGE_TIPS[badge]);
    }
  }
  // Optionally, add generic tips for certain badge combinations
  if (badges.includes('Ultra-Processed')) {
    tips.push('Try to include more whole, minimally processed foods in your diet.');
  }
  return tips;
}

const AddItemScreen: React.FC = () => {
  const navigation = useNavigation<AddItemNavProp>();
  const route = useRoute<AddItemRouteProp>();
  const { addProduct, updateProduct } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { lookupBarcode } = useBarcodeLookup();

  // Check if we're editing an existing product
  const productToEdit = route.params?.product;
  const isEditMode = Boolean(productToEdit);

  // Local state for form fields
  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcode, setBarcode] = useState(route.params?.barcode ?? '');
  const [category, setCategory] = useState('');
  const [storageLocation, setStorageLocation] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (productToEdit) {
      setProductName(productToEdit.name);
      setExpiryDate(productToEdit.expiryDate);
      setBarcode(productToEdit.barcode);
      setCategory(productToEdit.storageLocation); // assuming category stored same
      setStorageLocation(productToEdit.storageLocation);
    }
  }, [productToEdit]);

  /**
   * Handle form submission for add or update.
   * Validates required fields and triggers context method.
   */
  const handleSubmit = async () => {
    if (!productName || !expiryDate || !barcode || !category || !storageLocation) {
      Alert.alert('Missing fields', 'Please fill out all fields before saving.');
      return;
    }
    try {
      if (isEditMode && productToEdit) {
        // Update existing product
        await updateProduct(productToEdit.id, {
          name: productName,
          barcode,
          expiry_date: expiryDate,
          category,
          storage_location: storageLocation,
        });
        navigation.navigate('Main');
      } else {
        // Add new product with health badges and tips
        let badges: string[] = [];
        let health_tips: string[] = [];
        // Only populate badges/tips if lookupBarcode returns badges (i.e., not manual entry)
        const result = await lookupBarcode(barcode);
        if (result.success && result.data?.badges && result.data.badges.length > 0) {
          badges = result.data.badges;
          health_tips = getHealthTipsFromBadges(badges);
        }
        await addProduct({
          name: productName,
          barcode,
          expiry_date: expiryDate,
          category,
          storage_location: storageLocation,
          details: '',
          badges,
          health_tips,
        });
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'There was a problem saving the product.');
    }
  };

  // Convert categories to picker items format
  const categoryItems = [
    { label: 'Select a Category...', value: '' },
    ...categories.map(cat => ({ label: cat.name, value: cat.name })),
    { label: '+ Add New Category', value: 'ADD_NEW' },
  ];

  const storageLocationItems = [
    { label: 'Select Storage...', value: '' },
    { label: 'Fridge', value: 'Fridge' },
    { label: 'Pantry', value: 'Pantry' },
    { label: 'Freezer', value: 'Freezer' },
  ];

  const handleCategoryChange = (value: string) => {
    if (value === 'ADD_NEW') {
      setShowCategoryModal(true);
    } else {
      setCategory(value);
    }
  };

  const handleDateSelect = (date: string) => {
    setExpiryDate(date);
  };

  const formatExpiryDate = (date: string) => {
    if (!date) return '';
    return dayjs(date).format('MMM DD, YYYY');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#141414" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Edit Item' : 'Add Item'}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Product Name *</Text>
        </View>
        <CustomTextInput
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
          testID="product-name-input"
          required={true}
        />
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Expiration Date *</Text>
        </View>
        <TouchableOpacity
          style={styles.dateInputContainer}
          onPress={() => setShowCalendarPicker(true)}
          testID="product-expiry-input"
        >
          <Text style={[styles.dateInputText, !expiryDate && styles.placeholderText]}>
            {expiryDate ? formatExpiryDate(expiryDate) : 'Tap to select expiry date'}
          </Text>
          <Ionicons name="calendar-outline" size={20} color="#757575" />
        </TouchableOpacity>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Barcode Number *</Text>
        </View>
        <CustomTextInput
          placeholder="Barcode Number"
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="numeric"
          rightElement={
            <TouchableOpacity
              onPress={() => navigation.navigate('ScanBarcode')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.barcodeButton}
              testID="scan-barcode-button"
            >
              <BarcodeIcon width={18} height={18} fill="#fff" />
            </TouchableOpacity>
          }
          testID="product-barcode-input"
          required={true}
        />
        <CustomPicker
          selectedValue={category}
          onValueChange={handleCategoryChange}
          items={categoryItems}
          style={{ marginBottom: 0 }}
          rightElement={<Ionicons name="chevron-down" size={20} color="#757575" />}
          testID="product-category-picker"
          required={true}
          label="Category"
        />
        <CustomPicker
          selectedValue={storageLocation}
          onValueChange={setStorageLocation}
          items={storageLocationItems}
          rightElement={<Ionicons name="chevron-down" size={20} color="#757575" />}
          testID="product-storage-picker"
          label="Storage Location"
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          testID="save-product-button"
        >
          <Text style={styles.submitButtonText}>
            {isEditMode ? 'Save Changes' : 'Add Item'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      />

      <CalendarPicker
        visible={showCalendarPicker}
        onClose={() => setShowCalendarPicker(false)}
        onDateSelect={handleDateSelect}
        selectedDate={expiryDate}
        minimumDate={dayjs().format('YYYY-MM-DD')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  container: {
    padding: 16,
  },
  labelContainer: {
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  label: {
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
    color: '#141414',
  },
  barcodeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  dateInputText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#141414',
    flex: 1,
  },
  placeholderText: {
    color: '#757575',
  },
});

export default AddItemScreen;