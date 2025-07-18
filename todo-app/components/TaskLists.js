import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TaskLists = ({ tasks, onToggle, onDelete }) => {
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Pressable onPress={() => onToggle(item.id)}>
        <MaterialCommunityIcons
          name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={28}
          color="#f3439b"
          style={styles.checkbox}
        />
      </Pressable>
      <Text style={[styles.taskText, item.completed && styles.completedTask]}>
        {item.text}
      </Text>
      <Pressable onPress={() => onDelete(item.id)} style={styles.deleteButton}>
        <MaterialCommunityIcons name="delete-outline" size={24} color="#f3439b" />
      </Pressable>
    </View>
  );

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default TaskLists;

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 100,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe4ed',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 15,
    paddingVertical: 14,
    paddingHorizontal: 18,
    elevation: 4,
  },
  checkbox: {
    marginRight: 15,
  },
  taskText: {
    flex: 1,
    fontSize: 18,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    marginLeft: 10,
  },
});
