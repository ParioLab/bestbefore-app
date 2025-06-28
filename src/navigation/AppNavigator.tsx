/**
 * @file src/navigation/AppNavigator.tsx
 * @description
 * Defines the root stack navigator for the BestBefore app.
 * Includes Welcome, Main (TabNavigator), AddItem, ScanBarcode, and ProductDetails screens.
 *
 * @notes
 * - Updated AddItem route to accept an optional full product object for editing.
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import TabNavigator from './TabNavigator';
import AddItemScreen from '../screens/AddItemScreen';
import ScanBarcodeScreen from '../screens/ScanBarcodeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import { Product as UIProduct } from '../components/ProductCard';

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  AddItem: { 
    barcode?: string; 
    product?: UIProduct; 
  };
  ScanBarcode: undefined;
  ProductDetails: { 
    product: UIProduct; 
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="ScanBarcode" component={ScanBarcodeScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;