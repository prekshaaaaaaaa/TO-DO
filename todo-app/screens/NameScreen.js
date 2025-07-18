// NameScreen: Allows the user to enter and save their name
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const NameScreen = ({ navigation, setUserName }) => {
  // State for the name input
  const [name, setName] = useState('');

  // Handle saving the name when the button is pressed
  const handlePress = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name!');
      return;
    }
    try {
      // Save the name to AsyncStorage for local caching
      await AsyncStorage.setItem('userName', name.trim());
      // Optionally update the parent state if provided
      setUserName && setUserName(name.trim());
      // No manual navigation here; navigation is handled by App.js
    } catch (error) {
      console.error('Error saving name:', error);
      Alert.alert('Error', 'Could not save name.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        {/* Display a welcome message with the entered name */}
        <Text style={styles.text}>Welcome {name}!</Text>
        {/* Name input field */}
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
        {/* Save button */}
        <Pressable style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Let's Go</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NameScreen;

// Basic styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  head: {
    height: '65%',
    backgroundColor: 'pink',
    width: '100%',
    borderRadius: 500,
    marginTop: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop:-50,
    color:'#d31775ff'
  },
  input: {
    width: '80%',
    borderBottomColor: '#f35aa6ff',
    borderBottomWidth: 2,
    fontSize: 18,
    padding: 10,
    marginBottom: 50,
    color: '#000',
  },
  button: {
    backgroundColor: '#f3439b',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
