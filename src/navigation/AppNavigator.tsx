import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import TabNavigator from './TabNavigator';
import AddItemScreen from '../screens/AddItemScreen';
import ScanBarcodeScreen from '../screens/ScanBarcodeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import { Product } from '../components/ProductCard';

export type RootStackParamList = {
  Welcome: undefined;
  Main: undefined;
  AddItem: { barcode?: string };
  ScanBarcode: undefined;
  ProductDetails: { product: Product };
  // Add other screens here
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