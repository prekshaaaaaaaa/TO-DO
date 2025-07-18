// TodoScreen: Main to-do list screen with calendar, profile, and theme toggle
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Pressable, TouchableWithoutFeedback, Image, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskManager from '../components/TaskManager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const TodoScreen = ({ isDarkTheme, setIsDarkTheme }) => {
  const navigation = useNavigation();
  // State for calendar and profile
  const [expanded, setExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('User');
  const animatedHeight = useRef(new Animated.Value(50)).current;

  // Load profile image and user name on mount and when screen is focused
  useEffect(() => {
    loadProfileImage();
    loadUserName();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadProfileImage();
      loadUserName(); // Always reload the name when screen is focused
    }, [])
  );

  // Load profile image from AsyncStorage or Firestore
  const loadProfileImage = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      // Try AsyncStorage first
      const localUrl = await AsyncStorage.getItem('profileImage');
      if (localUrl) {
        setProfileImage(localUrl);
      } else {
        // Fetch from Firestore if not in AsyncStorage
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().profileImage) {
          setProfileImage(userDoc.data().profileImage);
          await AsyncStorage.setItem('profileImage', userDoc.data().profileImage);
        }
      }
    } catch (error) {}
  };

  // Load user name from AsyncStorage
  const loadUserName = async () => {
    try {
      const savedName = await AsyncStorage.getItem('userName');
      if (savedName) {
        setUserName(savedName);
      }
    } catch (error) {}
  };

  // Expand/collapse calendar
  const toggleExpand = () => {
    if (!expanded) {
      setExpanded(true);
      Animated.timing(animatedHeight, {
        toValue: 400,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  };

  const collapse = () => {
    if (expanded) {
      Animated.timing(animatedHeight, {
        toValue: 50,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setExpanded(false));
    }
  };

  // Get weekday name for selected date
  const getWeekdayName = (dateStr) => {
    const date = new Date(dateStr);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[date.getDay()];
  };

  // Navigate to profile screen
  const handleCatPress = () => {
    navigation.navigate('Profile');
  };

  // Toggle dark/light theme
  const toggleTheme = () => {
    setIsDarkTheme && setIsDarkTheme(!isDarkTheme);
  };

  return (
    <TouchableWithoutFeedback onPress={collapse}>
      <View style={[styles.container, isDarkTheme && styles.darkContainer]}>
        {/* Header with profile and theme toggle */}
        <View style={styles.backgroundHeader} />
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>TO-DO LIST</Text>
          <Text style={styles.welcomeText}>Welcome {userName}</Text>
          {/* Theme toggle button */}
          <Pressable style={styles.themeButton} onPress={toggleTheme}>
            <MaterialCommunityIcons
              name={isDarkTheme ? 'weather-sunny' : 'weather-night'}
              size={24}
              color="white"
            />
          </Pressable>
          {/* Profile (cat) button */}
          <Pressable style={styles.catButton} onPress={handleCatPress}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <MaterialCommunityIcons name="cat" size={30} color="#f3439b" />
            )}
          </Pressable>
        </View>
        {/* Expandable calendar section */}
        <Pressable onPress={toggleExpand}>
          <Animated.View style={[styles.calendarContainer, isDarkTheme && styles.darkCalendarContainer, { height: animatedHeight }]}> 
            <View style={styles.collapsedHeader}>
              <Text style={styles.calendarHeaderText}>Calendar</Text>
            </View>
            {expanded ? (
              <View style={styles.calendarWrapper}>
                {/* Calendar with custom dayComponent and past date alert */}
                <Calendar
                  style={styles.calendar}
                  onDayPress={(day) => {
                    const today = new Date();
                    const clickedDate = new Date(day.dateString);
                    today.setHours(0,0,0,0);
                    clickedDate.setHours(0,0,0,0);
                    if (clickedDate < today) {
                      Alert.alert("Not Allowed", "Tasks cannot be added in the past");
                      return;
                    }
                    setSelectedDate(day.dateString);
                  }}
                  markedDates={{
                    ...markedDates,
                    [selectedDate]: {
                      ...markedDates[selectedDate],
                      selected: true,
                      selectedColor: '#f3439b',
                    },
                  }}
                  theme={{
                    todayTextColor: '#f3439b',
                  }}
                  dayComponent={({ date, state }) => {
                    // Cross out past dates
                    const today = new Date();
                    const thisDate = new Date(date.dateString);
                    const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    return (
                      <View>
                        <Text
                          style={{
                            textDecorationLine: isPast ? 'line-through' : 'none',
                            color: state === 'disabled' ? '#d9e1e8' : isPast ? '#888' : '#2d4150',
                            textAlign: 'center',
                          }}
                        >
                          {date.day}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            ) : null}
          </Animated.View>
        </Pressable>
        {/* Main body with weekday and task manager */}
        <View style={[styles.body, isDarkTheme && styles.darkBody]}>
          <Text style={[styles.dayText, isDarkTheme && styles.darkDayText]}>
            {getWeekdayName(selectedDate)}
          </Text>
          <TaskManager
            selectedDate={selectedDate}
            setMarkedDates={setMarkedDates}
            isDarkTheme={isDarkTheme}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TodoScreen;

// Basic styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  box: {
    backgroundColor: 'pink',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topHeader: {
    height: 150,
    backgroundColor: '#f3439b', // always pink
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 40,
    paddingHorizontal: 20,
    position: 'relative',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white', // always white
  },
  subtext: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 4,
  },
  calendarContainer: {
    backgroundColor: '#f78bb6', // darker pink, 5 shades lighter than header1
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  calendarWrapper: {
    flex: 1,
    marginTop: 10,
    padding: 10,
  },
  calendar: {
    borderRadius: 10,
  },
  collapsedHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsedHeaderText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  dayText: {
    textAlign: 'left',
    fontSize: 25,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
    paddingBottom: 10,
    borderBottomColor: '#f3439b',
    borderBottomWidth: 2,
    marginBottom: 20
  },
  themeButton: {
    position: 'absolute',
    top: 50,
    right: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  catButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  darkContainer: {
    backgroundColor: 'black',
  },
  darkBox: {},
  darkBody: {
    backgroundColor: 'black',
  },
  darkDayText: {
    color: 'white',
  },
  darkCalendarContainer: {
    backgroundColor: '#f78bb6', // darker pink in dark mode
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header2: {
    backgroundColor: '#ffd1e3',
    height: 50,
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160, // 10px more than header1
    backgroundColor: '#f78bb6',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 0,
  },
  calendarHeaderText: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  headerTitle: {
    position: 'absolute',
    top: 46,
    left: 20,
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1.5,
    zIndex: 2,
  },
  welcomeText: {
    position: 'absolute',
    top: 110,
    left: 20,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    zIndex: 2,
  },
  calendarHeaderContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  calendarHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f3439b',
    letterSpacing: 1.2,
  },
});
