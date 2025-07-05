import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

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

interface ProductCardProps {
  product: Product;
}

type ProductCardNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigation = useNavigation<ProductCardNavigationProp>();
  const isExpiring = dayjs(product.expiryDate).diff(dayjs(), 'day') <= 2;
  const isLactantia = product.name === 'Lactantia Lactose Free Milk';

  let cardStyle = 'glass';
  if (isLactantia) {
    cardStyle = 'lactantia';
  } else if (isExpiring) {
    cardStyle = 'expiring';
  }

  const getBlurContainerStyle = () => {
    switch (cardStyle) {
      case 'lactantia':
        return styles.lactantiaBlur;
      case 'expiring':
        return styles.expiringBlur;
      default:
        return styles.glassBlur;
    }
  };

  const getProductNameStyle = () => {
    switch (cardStyle) {
      case 'lactantia':
        return styles.lactantiaProductName;
      case 'expiring':
        return styles.expiringProductName;
      default:
        return styles.productName;
    }
  };

  const getExpiryTextStyle = () => {
    switch (cardStyle) {
      case 'lactantia':
        return styles.lactantiaExpiryText;
      case 'expiring':
        return styles.expiringExpiryText;
      default:
        return styles.expiryText;
    }
  };

  const handlePress = () => {
    navigation.navigate('ProductDetails', { product });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <BlurView
          intensity={70}
          tint={cardStyle === 'expiring' ? 'dark' : 'light'}
          style={[styles.blurBase, getBlurContainerStyle()]}
        >
          <Image source={product.image} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={getProductNameStyle()}>{product.name}</Text>
            <Text style={getExpiryTextStyle()}>
              Expires in {dayjs(product.expiryDate).diff(dayjs(), 'day')} days
            </Text>
          </View>
        </BlurView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  blurBase: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },
  glassBlur: {
    backgroundColor: 'rgba(250, 250, 250, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  lactantiaBlur: {
    backgroundColor: 'rgba(250, 89, 89, 0.61)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  expiringBlur: {
    backgroundColor: 'rgba(254, 103, 103, 0.85)', // Figma red with some transparency
    borderColor: 'rgba(251, 89, 89, 0.28)',       // Figma border
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  productName: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#141414',
  },
  lactantiaProductName: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#000000',
  },
  expiringProductName: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Manrope-Bold',
  },
  expiryText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#757575',
  },
  lactantiaExpiryText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#000000',
  },
  expiringExpiryText: {
    fontSize: 12,
    color: '#FF9E9E',
    fontFamily: 'Manrope-Bold',
  },
});

export default ProductCard; 