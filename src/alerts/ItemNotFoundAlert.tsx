import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface ItemNotFoundAlertProps {
  visible: boolean;
  onClose: () => void;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'ScanBarcode'>;

export const ItemNotFoundAlert: React.FC<ItemNotFoundAlertProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleEnterManually = () => {
    onClose();
    navigation.navigate('AddItem', {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Item Not Found</Text>
          <Text style={styles.message}>We couldn't find a product with that barcode.</Text>
          <TouchableOpacity style={styles.button} onPress={handleEnterManually}>
            <Text style={styles.buttonText}>Enter Manually</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#141414',
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#141414',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    color: '#141414',
    fontSize: 14,
  },
});

export default ItemNotFoundAlert; 