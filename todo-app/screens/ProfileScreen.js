
import React, { useState } from 'react';
import {View,Text,Image,Button,Alert,StyleSheet,ActivityIndicator,TextInput,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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

  return (
    <View style={styles.container}>
      {/* Profile image section */}
      <View style={styles.profileSection}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        {uploading && <ActivityIndicator style={{ marginTop: 10 }} />}
        <Button title="Upload Photo" onPress={handleUploadPhoto} disabled={uploading} />
      </View>
      {/* User info section */}
      <View style={styles.infoSection}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email}</Text>
        <Text style={styles.label}>Name:</Text>
        {editingName ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            onBlur={handleSaveName}
            autoFocus
            placeholder="Enter your name"
          />
        ) : (
          <View style={styles.nameRow}>
            <Text style={styles.value}>{name}</Text>
            <Button title="Edit" onPress={() => setEditingName(true)} />
          </View>
        )}
      </View>
      {/* Logout button */}
      <Button title="Log Out" onPress={handleLogout} color="#f3439b" />
    </View>
  );
};

// Basic styles for layout and appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  infoSection: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    padding: 5,
    marginBottom: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen; 