import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TodoScreen from '../screens/TodoScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTab({ isDarkTheme, setIsDarkTheme }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: isDarkTheme ? '#f3439b' : '#f3439b',
        tabBarInactiveTintColor: isDarkTheme ? '#f8bbd0' : 'gray',
        tabBarStyle: {
          backgroundColor: isDarkTheme ? '#232323' : 'white',
          borderTopWidth: 0.5,
          borderTopColor: isDarkTheme ? '#333' : '#eee',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'To-Do List') {
            iconName = 'check-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = 'account-circle-outline';
          }
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={isDarkTheme ? '#f3439b' : color}
              style={{ fontWeight: focused ? 'bold' : 'normal' }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="To-Do List">
        {props => <TodoScreen {...props} isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} isDarkTheme={isDarkTheme} setIsDarkTheme={setIsDarkTheme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
} 