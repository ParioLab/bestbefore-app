import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = ({ route, navigation }: Props) => {
  const { item } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.container}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Product Name</Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Expiration Date</Text>
          <Text style={styles.value}>{item.expiry}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
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
  infoRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: '#757575',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
  },
});

export default ProductDetailsScreen; 