import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

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
      <Feather name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );
};

const SettingsSection: React.FC<{ title: string }> = ({ title }) => {
  return <Text style={styles.sectionTitle}>{title}</Text>;
};

const SettingsScreen = () => {
  const [reminderFrequency, setReminderFrequency] = useState('5');
  const [isPickerVisible, setPickerVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Settings</Text>
        
        <SettingsSection title="Notifications" />
        <SettingsRow 
          icon="bell" 
          title="Reminder Frequency" 
          value={`${reminderFrequency} days to exp. date`}
          onPress={() => setPickerVisible(true)}
        />

        <SettingsSection title="Profile" />
        <SettingsRow 
          icon="user" 
          title="Profile Settings" 
          subtitle="Edit your profile information"
          onPress={() => console.log('Navigate to Profile Settings')}
        />

        <SettingsSection title="Support" />
        <SettingsRow 
          icon="help-circle" 
          title="Help & Support"
          onPress={() => console.log('Navigate to Help & Support')}
        />
        <SettingsRow 
          icon="file-text" 
          title="Terms of Service"
          onPress={() => console.log('Navigate to Terms of Service')}
        />
        <SettingsRow 
          icon="shield" 
          title="Privacy Policy"
          onPress={() => console.log('Navigate to Privacy Policy')}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setPickerVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text style={styles.doneButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={reminderFrequency}
              onValueChange={(itemValue) => setReminderFrequency(itemValue)}
            >
              <Picker.Item label="3 days" value="3" />
              <Picker.Item label="5 days" value="5" />
              <Picker.Item label="10 days" value="10" />
            </Picker>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F2F2F2',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    padding: 16,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  doneButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SettingsScreen; 