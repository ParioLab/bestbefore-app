import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Product as UIProduct } from './ProductCard';

interface ProductSummaryCardProps {
  product: UIProduct;
}

const ProductSummaryCard: React.FC<ProductSummaryCardProps> = ({ product }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'ProductDetails'>>();
  // Format expiry date and determine card color
  const today = new Date();
  const expiry = new Date(product.expiryDate);
  const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = diff <= 2;
  const cardColor = isExpiringSoon ? '#FF6F61' : '#4CD964'; // red if expiring soon, green otherwise

  const getExpiryStatus = () => {
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Expires today';
    return `Expires in ${diff} day${diff === 1 ? '' : 's'}`;
  };

  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.label}>Barcode <Text style={styles.value}>{product.barcode}</Text></Text>
          <Text style={styles.label}>Expiry <Text style={styles.value}>{getExpiryStatus()}</Text></Text>
          <Text style={styles.label}>Storage <Text style={styles.value}>{product.storageLocation || '--'}</Text></Text>
        </View>
        <View style={styles.gradeContainer}>
          <Text style={styles.nutriScoreLabel}>Nutri-Score</Text>
          <Text style={styles.gradeText}>{product.nutrition_grade ? product.nutrition_grade.toUpperCase() : '--'}</Text>
        </View>
      </View>
      {/* Detailed Analysis Button */}
      <TouchableOpacity
        style={styles.analysisButton}
        onPress={() => navigation.navigate('ProductDetails', { product })}
        activeOpacity={0.85}
      >
        <Text style={styles.analysisButtonText}>Detailed Analysis</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginVertical: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginTop: 2,
  },
  value: {
    fontWeight: '600',
    color: '#fff',
  },
  gradeContainer: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    minHeight: 64,
    marginLeft: 16,
  },
  nutriScoreLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    fontWeight: '500',
    marginBottom: 2,
  },
  gradeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  analysisButton: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  analysisButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default ProductSummaryCard; 