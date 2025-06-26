import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomTextInput from '../components/CustomTextInput';
import CustomPicker from '../components/CustomPicker';
import BarcodeIcon from '../../assets/images/barcode-icon.svg';
import { Ionicons } from '@expo/vector-icons';

type AddItemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddItem'>;
type AddItemScreenRouteProp = RouteProp<RootStackParamList, 'AddItem'>;

const AddItemScreen = () => {
  const navigation = useNavigation<AddItemScreenNavigationProp>();
  const route = useRoute<AddItemScreenRouteProp>();
  
  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [storageLocation, setStorageLocation] = useState('');

  useEffect(() => {
    if (route.params?.barcode) {
      setBarcode(route.params.barcode);
    }
  }, [route.params?.barcode]);

  const categoryItems = [
    { label: 'Select a Category...', value: '' },
    { label: 'Product', value: 'Product' },
    { label: 'Condiments', value: 'Condiments' },
  ];

  const storageLocationItems = [
    { label: 'Select a Storage Location...', value: '' },
    { label: 'Fridge', value: 'Fridge' },
    { label: 'Pantry', value: 'Pantry' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#141414" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Item</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <CustomTextInput
          placeholder="Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <CustomTextInput
          placeholder="Expiration Date"
          value={expiryDate}
          onChangeText={setExpiryDate}
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
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <BarcodeIcon width={18} height={18} fill="#fff" />
            </TouchableOpacity>
          }
        />
        <CustomPicker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          items={categoryItems}
          style={{ marginBottom: 0 }}
          rightElement={<Ionicons name="chevron-down" size={20} color="#757575" />}
        />
        <CustomPicker
          selectedValue={storageLocation}
          onValueChange={(itemValue) => setStorageLocation(itemValue)}
          items={storageLocationItems}
          rightElement={<Ionicons name="chevron-down" size={20} color="#757575" />}
        />
        <TouchableOpacity style={styles.scanButton} onPress={() => navigation.navigate('ScanBarcode')}>
          <BarcodeIcon width={20} height={20} />
          <Text style={styles.scanButtonText}>Scan Barcode</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scanButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default AddItemScreen; 