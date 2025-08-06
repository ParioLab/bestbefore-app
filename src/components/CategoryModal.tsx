/**
 * @file src/components/CategoryModal.tsx
 * @description
 * Modal component for adding and editing categories.
 * Provides a form interface for category management.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCategories } from '../hooks/useCategories';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  categoryToEdit?: { id: string; name: string } | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ 
  visible, 
  onClose, 
  categoryToEdit 
}) => {
  const { addCategory, updateCategory } = useCategories();
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(categoryToEdit);

  // Reset form when modal opens/closes or when editing different category
  useEffect(() => {
    if (visible) {
      setCategoryName(categoryToEdit?.name || '');
      setIsSubmitting(false);
    }
  }, [visible, categoryToEdit]);

  const handleSubmit = async () => {
    const trimmedName = categoryName.trim();
    
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    if (trimmedName.length > 50) {
      Alert.alert('Error', 'Category name must be 50 characters or less.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditMode && categoryToEdit) {
        await updateCategory(categoryToEdit.id, trimmedName);
      } else {
        await addCategory(trimmedName);
      }
      
      setCategoryName('');
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      Alert.alert(
        'Error', 
        isEditMode 
          ? 'Failed to update category. Please try again.' 
          : 'Failed to create category. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCategoryName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#757575" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Edit Category' : 'Add Category'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Enter category name..."
              autoFocus={true}
              maxLength={50}
              autoCapitalize="words"
              autoCorrect={false}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button, 
                  styles.submitButton,
                  (!categoryName.trim() || isSubmitting) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                disabled={!categoryName.trim() || isSubmitting}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  content: {
    padding: 16,
  },
  label: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#141414',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Manrope-Regular',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#000000',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  cancelButtonText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#757575',
  },
  submitButtonText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default CategoryModal; 