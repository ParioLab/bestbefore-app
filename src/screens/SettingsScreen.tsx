import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, title, subtitle, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={24} color="#141414" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {value && <Text style={styles.value}>{value}</Text>}
      {onPress && <Feather name="chevron-right" size={24} color="#757575" />}
    </TouchableOpacity>
  );
};

const SettingsSection: React.FC<{ title: string }> = ({ title }) => {
  return <Text style={styles.sectionTitle}>{title}</Text>;
};

type SettingsNavProp = StackNavigationProp<RootStackParamList, 'Main'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsNavProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Settings</Text>
        
        <SettingsSection title="Notifications" />
        <SettingsRow 
          icon="bell" 
          title="Frequency Reminder"
          subtitle="Set reminder frequency for each category"
          onPress={() => navigation.navigate('FrequencyReminder' as any)}
        />

        <SettingsSection title="Profile" />
        <SettingsRow 
          icon="user" 
          title="Profile Settings" 
          subtitle="Edit your profile information"
          onPress={() => console.log('Navigate to Profile Settings')}
        />

        <SettingsSection title="Billing & Payments" />

        <SettingsRow 
          icon="package" 
          title="Premium"
          subtitle="Manage your subscription plan"
          onPress={() => navigation.navigate('PremiumPlan' as any)}
        />
        <SettingsRow 
          icon="receipt" 
          title="Billing History"
          subtitle="View your past invoices"
          onPress={() => console.log('Navigate to Billing History')}
        />

        <SettingsSection title="Support" />
        <SettingsRow 
          icon="help-circle" 
          title="Help & Support"
          onPress={() => console.log('Navigate to Help & Support')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100, // Padding for floating tab bar
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#141414',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#141414',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#141414',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  value: {
    fontSize: 14,
    color: '#757575',
    marginRight: 8,
  },
});

export default SettingsScreen; 