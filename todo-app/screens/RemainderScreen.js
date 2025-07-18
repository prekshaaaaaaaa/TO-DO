import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMAINDER_MESSAGES = [
  'Every beginning is difficult, but it becomes easier.',
  'Stay positive, work hard, make it happen.',
  'Small steps every day lead to big results.',
  'You are capable of amazing things.',
  'Don’t watch the clock; do what it does. Keep going.',
  'Success is the sum of small efforts, repeated day in and day out.',
  'Believe in yourself and all that you are.',
  'Difficult roads often lead to beautiful destinations.',
  'Push yourself, because no one else is going to do it for you.',
  'Great things never come from comfort zones.'
];

const RemainderScreen = ({ navigation }) => {
  const [reminder, setReminder] = useState(REMAINDER_MESSAGES[0]);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * REMAINDER_MESSAGES.length);
    setReminder(REMAINDER_MESSAGES[randomIndex]);
  }, []);

  useEffect(() => {
    const checkName = async () => {
      const name = await AsyncStorage.getItem('userName');
      setUserName(name);
    };
    checkName();
  }, []);

  const handleGoToTodo = () => {
    navigation.navigate('MainTabs', { screen: 'To-Do List' });
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem('remainderDone', 'true');
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Reminder</Text>
        </View>
        <View style={styles.messageBox}>
          <Text style={styles.message}>{reminder}</Text>
        </View>
        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={handleComplete}>
            <MaterialCommunityIcons name="heart-outline" size={20} color="#f06292" />
            <Text style={styles.buttonText}>Okay</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleComplete}>
            <MaterialCommunityIcons name="thumb-up-outline" size={20} color="#f06292" />
            <Text style={styles.buttonText}>Great</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default RemainderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4ef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 24,
    alignItems: 'center',
    paddingTop: 0,
    paddingBottom: 20,
    shadowColor: '#f06292',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  profileImageWrapper: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 4,
    elevation: 4,
    shadowColor: '#f06292',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  titleBar: {
    width: '100%',
    backgroundColor: '#f8bbd0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  messageBox: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe4ef',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#f8bbd0',
  },
  buttonText: {
    color: '#f06292',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
}); 