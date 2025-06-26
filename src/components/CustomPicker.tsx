import React, { useState, ReactNode } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CustomPickerProps {
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  items: { label: string; value: string }[];
  style?: object;
  rightElement?: ReactNode;
}

const CustomPicker: React.FC<CustomPickerProps> = ({ selectedValue, onValueChange, items, style, rightElement }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel = items.find(item => item.value === selectedValue)?.label || items[0]?.label;
  const isPlaceholder = !selectedValue || selectedValue === items[0]?.value;

  return (
    <>
      <TouchableOpacity style={[styles.container, style]} onPress={() => setModalVisible(true)}>
        <Text style={[styles.text, isPlaceholder && styles.placeholderText]}>
          {selectedLabel}
        </Text>
        {rightElement && (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        )}
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)} activeOpacity={1}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
              >
                {items.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#141414',
    flex: 1,
  },
  placeholderText: {
    color: '#757575',
  },
  rightElementContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerContainer: {},
  doneButton: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
  },
});

export default CustomPicker; 