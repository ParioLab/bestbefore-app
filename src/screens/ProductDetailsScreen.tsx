/**
 * @file src/screens/ProductDetailsScreen.tsx
 * @description
 * Screen displaying detailed product information and actions.
 * Allows the user to edit or delete the product.
 *
 * Key features:
 * - Displays product details in a read-only format.
 * - Provides Edit and Delete actions via the products context.
 *
 * @dependencies
 * - useProducts: Provides deleteProduct method.
 * - @react-navigation: For routing and navigation.
 *
 * @notes
 * - On delete, navigates back to the previous screen.
 * - On edit, navigates to AddItemScreen with the product data.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackArrowIcon from '../../assets/images/back-arrow-icon.svg';
import InfoRow from '../components/InfoRow';
import { BlurView } from 'expo-blur';
import dayjs from 'dayjs';
import { useProducts } from '../hooks/useProducts';
import { Product as UIProduct } from '../components/ProductCard';

type DetailsNavProp = StackNavigationProp<RootStackParamList, 'ProductDetails'>;
type DetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation<DetailsNavProp>();
  const route = useRoute<DetailsRouteProp>();
  const { deleteProduct, addProduct } = useProducts();
  const product: UIProduct = route.params.product;
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  /**
   * Confirm and delete the product, then navigate back.
   */
  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(product.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  /**
   * Navigate to AddItem screen passing current product for editing.
   */
  const handleEdit = () => {
    navigation.navigate('AddItem', { product });
  };

  /**
   * Confirm and add the product to the database and home list.
   */
  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await addProduct({
        name: product.name,
        barcode: product.barcode,
        expiry_date: product.expiryDate,
        category: (product as any).category || 'NaN',
        storage_location: product.storageLocation,
        details: product.details || '',
        badges: product.healthBadges || [],
        health_tips: product.healthTips || [],
      });
      setConfirmed(true);
      Alert.alert('Product Added', 'This product has been added to your list.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'There was a problem adding the product.');
    } finally {
      setIsConfirming(false);
    }
  };

  /**
   * Helper to get expiry status string.
   */
  const getExpiryStatus = () => {
    const today = dayjs().startOf('day');
    const expiry = dayjs(product.expiryDate).startOf('day');
    if (expiry.isBefore(today)) return 'Product is Expired';
    if (expiry.isSame(today)) return 'Expires today';
    const diff = expiry.diff(today, 'day');
    return `Expires in ${diff} day${diff === 1 ? '' : 's'}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Product Information</Text>
        <InfoRow label="Name" value={product.name} />
        <InfoRow label="Expires" value={getExpiryStatus()} />
        <InfoRow label="Barcode" value={product.barcode} />
        <InfoRow label="Storage" value={product.storageLocation} />

        {/* Health Badges */}
        {product.healthBadges && product.healthBadges.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Health Badges</Text>
            <View style={styles.badgesContainer}>
              {product.healthBadges.map((badge, idx) => (
                <View key={idx} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Health Tips */}
        {product.healthTips && product.healthTips.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={styles.sectionTitle}>Health Tips</Text>
            <View style={styles.tipsContainer}>
              {product.healthTips.map((tip, idx) => (
                <View key={idx} style={styles.tipRow}>
                  <Text style={styles.bullet}>{'\u2022'}</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Confirm Button at the bottom */}
      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, confirmed && { backgroundColor: '#B0B0B0' }]}
          onPress={handleConfirm}
          disabled={isConfirming || confirmed}
          testID="confirm-product-button"
        >
          <Text style={styles.confirmButtonText}>{confirmed ? 'Confirmed' : isConfirming ? 'Confirming...' : 'Confirm'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  container: { padding: 16 },
  sectionTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    marginVertical: 12,
    color: '#141414',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: '#141414',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    backgroundColor: '#E0F7E9',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 14,
    color: '#1B7F5A',
  },
  tipsContainer: {
    marginTop: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 16,
    color: '#1B7F5A',
    marginRight: 8,
    lineHeight: 20,
  },
  tipText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#141414',
    flex: 1,
    lineHeight: 20,
  },
  confirmButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: '#fff',
  },
});

export default ProductDetailsScreen;