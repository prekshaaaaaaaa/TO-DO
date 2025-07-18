import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Platform, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import LottieView from 'lottie-react-native';

const SigninScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignUp = async () => {
    const { email, password, confirmPassword } = form;
    if (!email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill all the fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Account Created', 'You can now log in!');
      await signOut(auth); 
      // navigation.navigate('Login') 
    } catch (error) {
      Alert.alert('Signup Failed ', error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.containers}>
          <View style={styles.heading}>
            <LottieView
              source={require('../assets/Dog.json')}
              autoPlay
              loop
              style={styles.dog}
            />
            <Text style={styles.text}>Hello!</Text>
            <Text style={styles.subtext}>Let's create a new account</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(value) => setForm({ ...form, confirmPassword: value })}
          />
          <Pressable style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.register}>Already have an account?Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: 'white',
  },
  heading: {
    height: '40%',
    backgroundColor: '#f3439b',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    justifyContent: 'center',
  },
  dog: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    marginTop: -100,
  },
  text: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -100,
  },
  subtext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginBottom:40
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
    color:"black",
    margin:25,
    fontSize:15,
    fontWeight:"bold",
    textAlign:"center"
  },
  
});
