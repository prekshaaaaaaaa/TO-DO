
import { initializeApp } from "firebase/app";
import { getAuth,initializeAuth,getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAjLPTcHvKPnwF50Vl6H2XhqaP_FblfMqk",
  authDomain: "todo-app-828d6.firebaseapp.com",
  projectId: "todo-app-828d6",
  storageBucket: "todo-app-828d6.appspot.com",  
  messagingSenderId: "845094565961",
  appId: "1:845094565961:web:eed5cccf2a2e6d73bf6798"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };