import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  
}

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#757575"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#141414',
  },
});

export default CustomTextInput; 