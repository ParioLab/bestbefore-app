import React, { ReactNode } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  rightElement?: ReactNode;
  required?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
  const { rightElement, style, required, value, ...textInputProps } = props;
  const showRequiredError = required && !value;
  
  return (
    <View style={[styles.container, style, showRequiredError && styles.requiredError]}> 
      <TextInput
        style={[
          styles.input,
          rightElement ? { paddingRight: 40 } : null
        ]}
        placeholderTextColor="#757575"
        value={value}
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
  requiredError: {
    borderColor: '#FF0000',
    borderWidth: 1,
  },
});

export default CustomTextInput; 