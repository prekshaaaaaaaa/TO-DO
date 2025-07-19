
import React, { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useEffect } from 'react';

// Import Firebase services
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileScreen = () => {
  // State variables for name, email, profile image, upload status, and edit mode
  const [name, setName] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);

  // Load profile data (image and name) when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const user = auth.currentUser;
        if (user) {
          setEmail(user.email);

          // Try to load profile image from AsyncStorage (local cache)
          const cachedImage = await AsyncStorage.getItem('profileImage');
          if (cachedImage) {
            setProfileImage(cachedImage);
          } else {
            // If not cached, load from Firestore and cache it
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              if (data.profileImage) {
                setProfileImage(data.profileImage);
                await AsyncStorage.setItem('profileImage', data.profileImage);
              }
            }
          }

          // Try to load name from AsyncStorage (local cache)
          const cachedName = await AsyncStorage.getItem('userName');
          if (cachedName) {
            setName(cachedName);
          } else {
            // If not cached, load from Firestore and cache it
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setName(data.name || '');
              await AsyncStorage.setItem('userName', data.name || '');
            }
          }
        }
      })();
    }, [])
  );

  // Listen for changes to userName in AsyncStorage and update instantly
  useEffect(() => {
    const interval = setInterval(async () => {
      const cachedName = await AsyncStorage.getItem('userName');
      if (cachedName && cachedName !== name) {
        setName(cachedName);
      }
    }, 1000); // check every second
    return () => clearInterval(interval);
  }, [name]);

  // Handle profile image upload
  const handleUploadPhoto = async () => {
    // Request permission to access media library
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission required to select photos');
      return;
    }

    // Let user pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    setUploading(true);

    try {
      // Convert image URI to blob for upload
      const response = await fetch(uri);
      const blob = await response.blob();

      // Upload image to Firebase Storage under profileImages/{userId}.jpg
      const userId = auth.currentUser.uid;
      const storageRef = ref(storage, `profileImages/${userId}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Save image URL to Firestore and cache in AsyncStorage
      await setDoc(doc(db, 'users', userId), { profileImage: downloadURL }, { merge: true });
      await AsyncStorage.setItem('profileImage', downloadURL);
      setProfileImage(downloadURL);

      Alert.alert('Success', 'Profile picture updated.');
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert('Upload failed', err.message || 'Unknown error');
    } finally {
      setUploading(false);
    }
  };

  // Handle saving the user's name
  const handleSaveName = async () => {
    try {
      const userId = auth.currentUser.uid;
      // Save name to Firestore and cache in AsyncStorage
      await setDoc(doc(db, 'users', userId), { name }, { merge: true });
      await AsyncStorage.setItem('userName', name);
      setEditingName(false);
    } catch (err) {
      console.error('Name save failed:', err);
      Alert.alert('Failed to save name');
    }
  };

  // Handle logout: clear local cache and sign out
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['profileImage', 'userName']);
      await auth.signOut();
    } catch {
      Alert.alert('Error logging out');
    }
  };

  // Helper to get initial
  const getInitial = () => {
    if (name && name.length > 0) return name[0].toUpperCase();
    if (email && email.length > 0) return email[0].toUpperCase();
    return 'U';
  };

  return (
    <View style={styles.container}>
      {/* Pink top section with avatar and decorative circles */}
      <View style={styles.topSection}>
        {/* Decorative circles/ellipses */}
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        <View style={styles.headerCircle3} />
        <View style={styles.avatarWrapper}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{getInitial()}</Text>
            </View>
          )}
        </View>
      </View>
      {/* Input fields */}
      <View style={styles.formSection}>
        {/* Name field with icon and edit */}
        <View style={styles.inputRow}>
          <FontAwesome name="user" size={22} color="#f3439b" style={styles.inputIcon} />
          {editingName ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              onBlur={handleSaveName}
              autoFocus
              placeholder="Name"
              placeholderTextColor="#f3439b"
            />
          ) : (
            <Text style={[styles.input, { color: name ? '#222' : '#aaa' }]}>{name || 'Name'}</Text>
          )}
          <TouchableOpacity onPress={() => setEditingName(true)} style={styles.editIconBtn}>
            <Feather name="edit-2" size={20} color="#f3439b" />
          </TouchableOpacity>
        </View>
        {/* Email field with icon */}
        <View style={styles.inputRow}>
          <MaterialIcons name="email" size={22} color="#f3439b" style={styles.inputIcon} />
          <Text style={[styles.input, { color: '#222' }]}>{email}</Text>
        </View>
        {/* Upload New Photo button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleUploadPhoto}
          disabled={uploading}
          activeOpacity={0.8}
        >
          <Feather name="camera" size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Upload New Photo</Text>
          {uploading && <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />}
        </TouchableOpacity>
        {/* Log Out button */}
        <TouchableOpacity
          style={[styles.button, { marginTop: 15 }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialIcons name="logout" size={22} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    backgroundColor: '#f9b6d2',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 80,
    overflow: 'hidden',
    position: 'relative',
  },
  headerCircle1: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 70,
    height: 40,
    borderRadius: 35,
    backgroundColor: '#f7c7de',
    opacity: 0.7,
  },
  headerCircle2: {
    position: 'absolute',
    top: 60,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  headerCircle3: {
    position: 'absolute',
    top: 90,
    left: 100,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    opacity: 0.2,
  },
  avatarWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f3439b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f3439b',
  },
  avatarInitial: {
    fontSize: 60,
    color: '#f3439b',
    fontWeight: 'bold',
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 30,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#f9b6d2',
    borderRadius: 30,
    paddingHorizontal: 16,
    marginBottom: 18,
    height: 54,
    shadowColor: '#f9b6d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#f3439b',
  },
  editIconBtn: {
    marginLeft: 8,
    padding: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3439b',
    borderRadius: 30,
    height: 54,
    marginTop: 10,
    marginBottom: 0,
    shadowColor: '#f3439b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 
