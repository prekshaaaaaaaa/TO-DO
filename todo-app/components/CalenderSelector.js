import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarSelector = ({ selectedDate, setSelectedDate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleAddTask = () => {
    if (!inputText.trim()) return;

    // Mark the selected date pink
    setMarkedDates((prev) => ({
      ...prev,
      [selectedDate]: {
        selected: true,
        selectedColor: '#f06292',
      },
    }));

    setInputText('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        dayComponent={({ date, state }) => {
          const isSelected = markedDates[date.dateString]?.selected;

          return (
            <TouchableOpacity
              onPress={() => handleDayPress({ dateString: date.dateString })}
              style={[
                styles.dateButton,
                isSelected && styles.selectedButton,
                state === 'disabled' && styles.disabledButton,
              ]}
              disabled={state === 'disabled'}
            >
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.selectedText,
                  state === 'disabled' && styles.disabledText,
                ]}
              >
                {date.day}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Custom Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Task for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter task"
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              autoFocus
            />
            <View style={styles.buttonGroup}>
              <Button 
                title="Cancel" 
                color="grey" 
                onPress={() => {
                  setModalVisible(false);
                  setInputText('');
                }} 
              />
              <Button 
                title="Add Task" 
                color="#f06292"
                onPress={handleAddTask} 
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CalendarSelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  calendar: {
    borderRadius: 10,
    marginHorizontal: 10,
  },
  dateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#f06292',
  },
  disabledButton: {
    backgroundColor: '#eee',
  },
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#bbb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
