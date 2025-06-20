import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import PlusIcon from '../../assets/images/plus-icon.svg';

const items = [
  { id: '1', name: 'Milk', expiry: 'Expires in 2 days', color: '#FF0000' },
  { id: '2', name: 'Eggs', expiry: 'Expires in 5 days', color: '#FFFFFF' },
  { id: '3', name: 'Cheese', expiry: 'Expires in 10 days', color: '#FFFFFF' },
  { id: '4', name: 'Yogurt', expiry: 'Expires in 15 days', color: '#FFFFFF' },
  { id: '5', name: 'Butter', expiry: 'Expires in 20 days', color: '#FFFFFF' },
];

type Item = {
  id: string;
  name: string;
  expiry: string;
  color: string;
};

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate('ProductDetails', { item })}
    >
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemExpiry}>{item.expiry}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Items</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddItem')}>
          <PlusIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemExpiry: {
    fontSize: 14,
    color: '#757575',
  },
});

export default HomeScreen; 