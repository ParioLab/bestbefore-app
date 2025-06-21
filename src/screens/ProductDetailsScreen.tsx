import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BackArrowIcon from '../../assets/images/back-arrow-icon.svg';
import InfoRow from '../components/InfoRow';
import { BlurView } from 'expo-blur';
import dayjs from 'dayjs';

type ProductDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetails'>;
type ProductDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = () => {
  const navigation = useNavigation<ProductDetailsScreenNavigationProp>();
  const route = useRoute<ProductDetailsScreenRouteProp>();
  const { product } = route.params;

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
        <InfoRow label="Product Name" value={product.name} />
        <BlurView intensity={20} tint="light" style={[styles.glassmorphism, styles.expirationDateGlass]}>
          <InfoRow label="Expiration Date" value={dayjs(product.expiryDate).format('YYYY-MM-DD')} />
        </BlurView>
        <InfoRow label="Barcode Number" value={product.barcode} />
        <InfoRow label="Storage Location" value={product.storageLocation} />
        <BlurView intensity={40} tint="light" style={[styles.glassmorphism, styles.detailsBox]}>
          <InfoRow label="Product Details" value={product.details} />
        </BlurView>

        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 22,
    color: '#141414',
    marginVertical: 12,
  },
  glassmorphism: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  expirationDateGlass: {
    backgroundColor: 'rgba(166, 255, 0, 0.21)',
  },
  detailsBox: {
    backgroundColor: 'rgba(255, 115, 0, 0.32)',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  actionButton: {
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '48%',
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
    color: '#141414',
  },
  continueButton: {
    backgroundColor: '#000000',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  continueButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default ProductDetailsScreen; 