// LoginScreens: Handles user login and navigation to registration or name entry
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreens({ navigation }) {
  // State for login form fields
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  // Handle login button press
  const handleLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {
      Alert.alert('Please enter both email and password.');
      return;
    }
    try {
      // Login in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // Remove cached userName so NameScreen will be shown if needed
      await AsyncStorage.removeItem('userName');
      navigation.navigate('Name');
    } catch (error) {
      Alert.alert('Wrong Password!', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated cat illustration */}
      <LottieView
        source={require('../assets/cat.json')}
        autoPlay
        loop
        style={styles.cat}
      />
      <Text style={styles.text}>Hello!</Text>
      <Text style={styles.subtext}>Let's Get Some Tasks Done</Text>
      {/* Email input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(value) => setForm({ ...form, email: value })}
      />
      {/* Password input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(value) => setForm({ ...form, password: value })}
      />
      {/* Login button */}
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      {/* Link to registration screen */}
      <Pressable onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.register}>Don't Have an account? Go to register</Text>
      </Pressable>
    </View>
  );
}

// Basic styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cat: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: -100,
  },
  heading: {
    height: '40%',
    backgroundColor: '#f3439b',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    justifyContent: 'center',
  },
  subtext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  input: {
    borderBottomColor: '#f35aa6ff',
    width: '80%',
    marginLeft: 40,
    marginTop: 40,
    borderBottomWidth: 2,
  },
  button: {
    backgroundColor: '#f3439b',
    borderRadius: 30,
    width: 260,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#d85094',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginLeft: 70,
    marginTop: 70,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  register:{
    color:'black',
    margin:25,
    fontSize:15,
    fontWeight:'bold',
    textAlign:'center'
  }
});
