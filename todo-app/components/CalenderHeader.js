import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
const CalendarHeader = ({ selectedDate, setSelectedDate }) => {
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString); // ISO format (e.g., 2025-07-16)
  };

  return (
    <View style={styles.wrapper}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#f3439b',
            selectedTextColor: 'white',
          },
        }}
        theme={{
          todayTextColor: '#f3439b',
        }}
      />

      {selectedDate && (
        <Text style={styles.dayText}>
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
          })}
        </Text>
      )}
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f8bbd0',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    color: '#333',
  },
});
