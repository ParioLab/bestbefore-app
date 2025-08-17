import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';

interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  selectedDate?: string;
  minimumDate?: string;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
  minimumDate = dayjs().format('YYYY-MM-DD'),
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs(selectedDate || dayjs()));
  const [selectedDay, setSelectedDay] = useState(dayjs(selectedDate || dayjs()));
  const [showYearPicker, setShowYearPicker] = useState(false);

  const getDaysInMonth = (date: dayjs.Dayjs) => {
    const start = date.startOf('month');
    const end = date.endOf('month');
    const days: dayjs.Dayjs[] = [];
    
    // Add days from previous month to fill first week
    const firstDayOfWeek = start.day();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(start.subtract(i + 1, 'day'));
    }
    
    // Add all days of current month
    for (let i = 0; i < end.date(); i++) {
      days.push(start.add(i, 'day'));
    }
    
    // Add days from next month to fill last week
    const lastDayOfWeek = end.day();
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      days.push(end.add(i, 'day'));
    }
    
    return days;
  };

  const handleDateSelect = (date: dayjs.Dayjs) => {
    if (date.isBefore(dayjs(minimumDate), 'day')) {
      return; // Don't allow selecting past dates
    }
    setSelectedDay(date);
  };

  const handleConfirm = () => {
    onDateSelect(selectedDay.format('YYYY-MM-DD'));
    onClose();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => prev.subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => prev.add(1, 'month'));
  };

  const generateYearOptions = () => {
    const currentYear = dayjs().year();
    const years = [];
    // Generate years from current year - 10 to current year + 10
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(year);
    }
    return years;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#141414" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Expiry Date</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
            <Ionicons name="chevron-back" size={20} color="#141414" />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth.format('MMMM')}
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
            <Ionicons name="chevron-forward" size={20} color="#141414" />
          </TouchableOpacity>
        </View>

        <View style={styles.yearSelector}>
          <TouchableOpacity 
            style={styles.yearButton}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.yearText}>{currentMonth.format('YYYY')}</Text>
            <Ionicons name="chevron-down" size={16} color="#757575" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekDaysHeader}>
          {weekDays.map(day => (
            <Text key={day} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>

        <ScrollView style={styles.calendarContainer}>
          <View style={styles.calendarGrid}>
            {days.map((day, index) => {
              const isCurrentMonth = day.month() === currentMonth.month();
              const isSelected = day.isSame(selectedDay, 'day');
              const isPast = day.isBefore(dayjs(minimumDate), 'day');
              const isToday = day.isSame(dayjs(), 'day');

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    !isCurrentMonth && styles.otherMonthDay,
                    isSelected && styles.selectedDay,
                    isPast && styles.pastDay,
                    isToday && styles.today,
                  ]}
                  onPress={() => handleDateSelect(day)}
                  disabled={isPast}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !isCurrentMonth && styles.otherMonthDayText,
                      isSelected && styles.selectedDayText,
                      isPast && styles.pastDayText,
                      isToday && styles.todayText,
                    ]}
                  >
                    {day.date()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>
              Confirm {selectedDay.format('MMM DD, YYYY')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.yearPickerOverlay}>
          <View style={styles.yearPickerContainer}>
            <View style={styles.yearPickerHeader}>
              <Text style={styles.yearPickerTitle}>Select Year</Text>
              <TouchableOpacity 
                onPress={() => setShowYearPicker(false)}
                style={styles.yearPickerCloseButton}
              >
                <Ionicons name="close" size={24} color="#141414" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.yearPickerScroll}>
              <View style={styles.yearPickerGrid}>
                {generateYearOptions().map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearOption,
                      year === currentMonth.year() && styles.selectedYearOption
                    ]}
                    onPress={() => {
                      setCurrentMonth(prev => prev.year(year));
                      setShowYearPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.yearOptionText,
                      year === currentMonth.year() && styles.selectedYearOptionText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
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
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  yearSelector: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F8F8F8',
  },
  yearText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#141414',
    marginRight: 8,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    color: '#757575',
    textTransform: 'uppercase',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 16,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#141414',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthDayText: {
    color: '#757575',
  },
  selectedDay: {
    backgroundColor: '#000',
    borderRadius: 20,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Bold',
  },
  pastDay: {
    opacity: 0.5,
  },
  pastDayText: {
    color: '#999999',
  },
  today: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
  },
  todayText: {
    fontFamily: 'Manrope-Bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F5F0',
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  yearPickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '80%',
    maxHeight: '70%',
  },
  yearPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F5F0',
  },
  yearPickerTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: '#141414',
  },
  yearPickerCloseButton: {
    padding: 4,
  },
  yearPickerScroll: {
    padding: 20,
  },
  yearPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  yearOption: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedYearOption: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  yearOptionText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 16,
    color: '#141414',
  },
  selectedYearOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Manrope-Bold',
  },
});

export default CalendarPicker;
