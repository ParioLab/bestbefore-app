import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  label: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#141414',
    marginBottom: 4,
  },
  value: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#757575',
  },
});

export default InfoRow; 