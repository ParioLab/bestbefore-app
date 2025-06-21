import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import ProductCard, { Product } from '../components/ProductCard';
import SearchIcon from '../../assets/images/search-icon.svg';
import dayjs from 'dayjs';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Lactantia Lactose Free Milk',
    expiryDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/milk.png'),
    barcode: '1234567890',
    storageLocation: 'Fridge',
    details: 'Lactantia Lactose Free Milk delivers the fresh, delicious taste of 100% Canadian milk without the discomfort. Enriched with calcium, protein, and vitamins A and D, it\'s easy to digest and perfect for the whole family'
  },
  {
    id: '2',
    name: 'Eggs',
    expiryDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/eggs.png'),
    barcode: '0987654321',
    storageLocation: 'Fridge',
    details: 'A dozen large, grade A eggs.'
  },
  {
    id: '3',
    name: 'Cheese',
    expiryDate: dayjs().add(10, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/cheese.png'),
    barcode: '1122334455',
    storageLocation: 'Fridge',
    details: 'A block of sharp cheddar cheese.'
  },
  {
    id: '4',
    name: 'Yogurt',
    expiryDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/yogurt.png'),
    barcode: '6677889900',
    storageLocation: 'Fridge',
    details: 'A container of plain Greek yogurt.'
  },
  {
    id: '5',
    name: 'Butter',
    expiryDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
    image: require('../../assets/images/butter.png'),
    barcode: '5544332211',
    storageLocation: 'Fridge',
    details: 'A stick of unsalted butter.'
  }
];

const HomeScreen = () => {
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
        <FlatList
          data={mockProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  searchIconContainer: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen; 