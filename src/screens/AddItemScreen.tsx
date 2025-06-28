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
 *
 * @dependencies
 * - useProducts: Provides addProduct and updateProduct methods.
 * - @react-navigation: For routing and retrieving navigation params.
 *
 * @notes
 * - Validates required fields before submission.
 * - Navigates back upon successful operation.
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
import BarcodeIcon from '../../assets/images/barcode-icon.svg';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '../hooks/useProducts';
import { Product as UIProduct } from '../components/ProductCard';

type AddItemNavProp = StackNavigationProp<RootStackParamList, 'AddItem'>;
type AddItemRouteProp = RouteProp<RootStackParamList, 'AddItem'>;

const AddItemScreen: React.FC = () => {
  const navigation = useNavigation<AddItemNavProp>();
  const route = useRoute<AddItemRouteProp>();
  const { addProduct, updateProduct } = useProducts();

  // Check if we're editing an existing product
  const productToEdit = route.params?.product;
  const isEditMode = Boolean(productToEdit);

  // Local state for form fields
  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcode, setBarcode] = useState(route.params?.barcode ?? '');
  const [category, setCategory] = useState('');
  const [storageLocation, setStorageLocation] = useState('');

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
      } else {
        // Add new product
        await addProduct({
          name: productName,
          barcode,
          expiry_date: expiryDate,
          category,
          storage_location: storageLocation,
          details: '',
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'There was a problem saving the product.');
    }
  };

  const categoryItems = [
    { label: 'Select a Category...', value: '' },
    { label: 'Fridge', value: 'Fridge' },
    { label: 'Pantry', value: 'Pantry' },
    { label: 'Freezer', value: 'Freezer' },
  ];

  const storageLocationItems = [
    { label: 'Select Storage...', value: '' },
    { label: 'Fridge', value: 'Fridge' },
    { label: 'Pantry', value: 'Pantry' },
    { label: 'Freezer', value: 'Freezer' },
  ];

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
        <CustomTextInput
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
          testID="product-name-input"
        />
        <CustomTextInput
          placeholder="Expiration Date (YYYY-MM-DD)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          testID="product-expiry-input"
        />
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
        />
        <CustomPicker
          selectedValue={category}
          onValueChange={setCategory}
          items={categoryItems}
          style={{ marginBottom: 0 }}
          rightElement={<Ionicons name="chevron-down" size={20} color="#757575" />}
          testID="product-category-picker"
        />
        <CustomPicker
          selectedValue={storageLocation}
          onValueChange={setStorageLocation}
          items={storageLocationItems}
          rightElement={<Ionicons name="chevron-down" size={20} color="#757575" />}
          testID="product-storage-picker"
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
});

export default AddItemScreen;