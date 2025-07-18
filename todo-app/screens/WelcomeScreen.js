import { StyleSheet, Text, View, Image, Pressable, ImageBackground } from 'react-native'
import React from 'react'

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
        <Image source={require('../assets/hotair.png')} style={styles.img} resizeMode="cover" />
        <Text style={styles.text}>Welcome!</Text>
        <Text style={styles.subtext}>Join the Adventure!</Text>
        <Pressable style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
   
      </View>

      
  );
};

export default WelcomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  img: {
    width: 400,
    height: 400,
    marginBottom: 10,
    alignSelf: "center",
  },
  text: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#f3439b",
    textAlign: "center",
    marginTop: 10,
  },
  subtext: {
    fontSize: 24,
    color: "#f78bb6",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#f3439b",
    borderRadius: 30,
    width: 260,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    elevation: 8,
    shadowColor: "#d85094",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
