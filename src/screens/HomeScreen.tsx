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
  ScrollView,
} from 'react-native';
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
        </View>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search" />
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loadingIndicator} />
        ) : (
          <ScrollView contentContainerStyle={styles.listContainer}>
            {products.map((product) => (
              <ProductSummaryCard key={product.id} product={product} />
            ))}
          </ScrollView>
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
  searchContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  searchInput: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
  },
  loadingIndicator: { marginTop: 50 },
  listContainer: { padding: 16 },
});