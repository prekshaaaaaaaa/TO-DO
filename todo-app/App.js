import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreens from './screens/LoginScreens';
import SigninScreen from './screens/SigninScreen';
import TodoScreen from './screens/TodoScreen';
import NameScreen from './screens/NameScreen';
import ProfileScreen from './screens/ProfileScreen';
import RemainderScreen from './screens/RemainderScreen';
import BottomTab from './components/BottomTab';
import { auth, db } from './firebaseConfig';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const navigationRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const savedName = await AsyncStorage.getItem('userName');
          setUserName(savedName);
        } catch (error) {
          setUserName(null);
        }
      } else {
        setUserName(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreens} />
            <Stack.Screen name="SignUp" component={SigninScreen} />
          </>
        ) : !userName ? (
          <>
            <Stack.Screen name="Name">
              {props => <NameScreen {...props} setUserName={setUserName} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Remainder" component={RemainderScreen} />
            <Stack.Screen name="MainTabs">
              {props => <BottomTab {...props} isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
