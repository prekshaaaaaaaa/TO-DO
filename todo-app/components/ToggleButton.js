import React, { useRef, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';

const ThemeToggleButton = ({ onToggle }) => {
  const animationRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    if (isDark) {
      animationRef.current?.play(50, 100); // to light
    } else {
      animationRef.current?.play(0, 50); // to dark
    }
    setIsDark(!isDark);
    onToggle?.(); // call the theme toggle function from parent
  };

  return (
    <Pressable onPress={handleToggle} style={styles.button}>
      <LottieView
        ref={animationRef}
        source={require('../assets/toggle.json')}
        loop={false}
        autoPlay={false}
        style={styles.lottie}
      />
    </Pressable>
  );
};

export default ThemeToggleButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
