// TaskManager: Handles displaying, adding, completing, and deleting tasks for the selected date
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const TaskManager = ({ selectedDate, setMarkedDates, isDarkTheme = false }) => {
  // State for new task input, task list, modal visibility, and loading
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Load tasks for the selected date and mark incomplete tasks on the calendar
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const unsub = onSnapshot(q, snapshot => {
      const fetchedTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(fetchedTasks.filter(task => task.date === selectedDate));
      const marked = {};
      fetchedTasks.forEach(task => {
        if (!task.completed) {
          marked[task.date] = {
            ...(marked[task.date] || {}),
            marked: true,
            dotColor: '#f06292',
          };
        }
      });
      setMarkedDates(marked);
    });
    return unsub;
  }, [selectedDate, setMarkedDates]);

  // Add a new task for the selected date
  const handleAddTask = () => {
    if (!newTask.trim() || !selectedDate) return;
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const taskText = newTask.trim();
    setNewTask('');
    setModalVisible(false);
    setIsAddingTask(true);
    addDoc(collection(db, 'tasks'), {
      text: taskText,
      completed: false,
      userId,
      date: selectedDate,
      createdAt: new Date(),
    })
      .then(() => setIsAddingTask(false))
      .catch(() => setIsAddingTask(false));
  };

  // Toggle completion status of a task
  const toggleTaskCompletion = async (taskId, currentCompleted) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { completed: !currentCompleted });
    } catch (error) {}
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {}
  };

  return (
    <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
      {/* Task list for the selected date */}
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        style={styles.taskList}
        contentContainerStyle={styles.taskListContent}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {/* Checkbox to toggle completion */}
            <Pressable onPress={() => toggleTaskCompletion(item.id, item.completed)} style={styles.checkboxContainer}>
              <MaterialCommunityIcons
                name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={28}
                color={item.completed ? '#f06292' : '#666'}
                style={styles.checkbox}
              />
            </Pressable>
            {/* Task text */}
            <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
              {item.text}
            </Text>
            {/* Delete button */}
            <Pressable onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
              <MaterialCommunityIcons name="delete-outline" size={24} color="black" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks for {selectedDate || 'this date'}</Text>
          </View>
        }
      />
      {/* Add task button */}
      <Pressable
        style={[styles.button, isDarkTheme && styles.darkButton]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, isDarkTheme && styles.darkButtonText]}>＋</Text>
      </Pressable>
      {/* Modal for adding a new task */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add task for {selectedDate}</Text>
            <TextInput
              placeholder="Enter task"
              value={newTask}
              onChangeText={setNewTask}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <View style={styles.btnRow}>
              <Pressable style={styles.close} onPress={() => setModalVisible(false)}>
                <Text style={styles.text}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.add, isAddingTask && styles.addDisabled]}
                onPress={handleAddTask}
                disabled={isAddingTask}
              >
                <Text style={styles.text}>{isAddingTask ? 'Adding...' : 'Add'}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default TaskManager;

// Basic styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  button: {
    position: 'absolute',
    height: 100,
    width: 100,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    marginLeft: 250,
    marginTop: 380
  },
  buttonText: {
    color: 'pink',
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: -8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginTop: 100,
    backgroundColor: '#444444',
    height: 350,
    width: 350,
    margin: 25,
    elevation: 20,
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    padding: 20
  },
  input: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width: '80%',
    marginLeft: 30,
    color: 'white',
    marginBottom: 30,
  },
  add: {
    backgroundColor: '#f355a4ff',
    width: 100,
    height: 50,
    padding: 15,
    elevation: 10,
    marginLeft: 170,
    marginTop: -50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  close: {
    backgroundColor: '#f355a4ff',
    width: 100,
    height: 50,
    padding: 15,
    elevation: 10,
    marginTop: 50,
    marginLeft: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    flex: 1,
    marginBottom: 100
  },
  taskList: {
    flex: 1,
    marginBottom: 100,
  },
  taskListContent: {
    paddingBottom: 150,
  },
  taskItem: {
    backgroundColor: '#ffe6f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkboxContainer: {
    padding: 5,
  },
  checkbox: {
    // No specific styles needed for the icon itself, it will be colored by the name prop
  },
  deleteButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
  },
  debugText: {
    color: 'black',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'yellow',
    padding: 5,
  },
  darkContainer: {
    backgroundColor: 'black',
  },
  darkButton: {
    backgroundColor: '#333',
  },
  darkButtonText: {
    color: '#ff1493',
  },
});
