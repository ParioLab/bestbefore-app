/**
 * @file src/screens/FrequencyReminderScreen.tsx
 * @description
 * Screen for managing category-specific reminder frequency settings.
 * Shows all user categories with their current reminder settings.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useCategoryReminders } from '../hooks/useCategoryReminders';
import { useCategories } from '../hooks/useCategories';

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, title, value, onPress }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Feather name={icon} size={24} color="#141414" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.rowTitle}>{title}</Text>
      </View>
      {value && <Text style={styles.value}>{value}</Text>}
      <Feather name="chevron-right" size={24} color="#757575" />
    </TouchableOpacity>
  );
};

const FrequencyReminderScreen: React.FC = () => {
  const navigation = useNavigation();
  const { categoryReminders, updateCategoryReminder } = useCategoryReminders();
  const { categories } = useCategories();
  const [selectedReminder, setSelectedReminder] = useState<{ id: string; categoryName: string; currentDays: number } | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleReminderPress = (reminder: { id: string; categoryName: string; currentDays: number }) => {
    setSelectedReminder(reminder);
    setPickerVisible(true);
  };

  const handleReminderChange = async (days: string) => {
    if (selectedReminder) {
      try {
        await updateCategoryReminder(selectedReminder.id, parseInt(days));
        setPickerVisible(false);
        setSelectedReminder(null);
      } catch (error) {
        console.error('Error updating reminder:', error);
      }
    }
  };

  // Get reminder for a category, with fallback to default
  const getReminderForCategory = (categoryName: string) => {
    const reminder = categoryReminders.find(r => r.category_name === categoryName);
    return reminder || { id: '', category_name: categoryName, reminder_days: 3 };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#141414" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequency Reminder</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView>
        <Text style={styles.description}>
          Set how many days before expiry you want to be notified for each category.
        </Text>
        
        {categories.map((category) => {
          const reminder = getReminderForCategory(category.name);
          return (
            <SettingsRow 
              key={category.id}
              icon="bell" 
              title={category.name}
              value={`${reminder.reminder_days} days to exp. date`}
              onPress={() => handleReminderPress({
                id: reminder.id,
                categoryName: category.name,
                currentDays: reminder.reminder_days
              })}
            />
          );
        })}
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
            {selectedReminder && (
              <View style={styles.pickerTitleContainer}>
                <Text style={styles.pickerTitle}>
                  {selectedReminder.categoryName} Reminders
                </Text>
              </View>
            )}
            <Picker
              selectedValue={selectedReminder?.currentDays.toString() || '3'}
              onValueChange={handleReminderChange}
            >
              <Picker.Item label="1 day" value="1" />
              <Picker.Item label="2 days" value="2" />
              <Picker.Item label="3 days" value="3" />
              <Picker.Item label="5 days" value="5" />
              <Picker.Item label="7 days (1 week)" value="7" />
              <Picker.Item label="10 days" value="10" />
              <Picker.Item label="14 days (2 weeks)" value="14" />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Manrope-Regular',
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
  pickerTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#141414',
    textAlign: 'center',
  },
  doneButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default FrequencyReminderScreen; 