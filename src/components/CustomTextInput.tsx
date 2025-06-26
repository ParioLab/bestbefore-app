import React, { ReactNode } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  rightElement?: ReactNode;
}

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
  const { rightElement, style, ...textInputProps } = props;
  return (
    <View style={[styles.container, style]}> 
      <TextInput
        style={[
          styles.input,
          rightElement ? { paddingRight: 40 } : null
        ]}
        placeholderTextColor="#757575"
        {...textInputProps}
      />
      {rightElement && (
        <View style={styles.rightElementContainer}>
          {rightElement}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#141414',
    flex: 1,
  },
  rightElementContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomTextInput; 