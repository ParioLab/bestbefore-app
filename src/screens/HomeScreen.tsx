import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import SearchIcon from '../../assets/images/search-icon.svg';
import { useProducts } from '../hooks/useProducts';
import ProductSummaryCard from '../components/ProductSummaryCard';

/**
 * HomeScreen displays a list of products (mock or fetched).
 */
const HomeScreen = () => {
  const { products, loading } = useProducts();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Items</Text>
          <TouchableOpacity style={styles.searchIconContainer}>
            <SearchIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search" />
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loadingIndicator} />
        ) : (
          <View>
            {products.map((product) => (
              <ProductSummaryCard key={product.id} product={product} />
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontFamily: 'Manrope-Bold', fontSize: 18, color: '#141414' },
  searchIconContainer: { padding: 8 },
  searchContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  searchInput: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
  },
  loadingIndicator: { marginTop: 50 },
});