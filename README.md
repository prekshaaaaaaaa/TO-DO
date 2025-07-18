# React Native To-Do App with Firebase

A sleek, calendar-based to-do app built using **React Native (Expo)** and **Firebase**. It features user authentication, personalized profiles, cloud storage for images, and a clean light/dark theme toggle.

---

## Features

- 🔐 **Firebase Authentication** (Email + Password)
- 📅 **Calendar-based Task Management**
- 🧍 **Profile screen** with:
  - Editable name (stored in Firestore)
  - Profile image upload (Firebase Storage)
- 🎨 **Light/Dark theme toggle**
- 📲 Works on both iOS and Android via **Expo Go**

---

## 📁 Folder Structure

todo-app/
│
├── assets/ # Lottie JSON, images
│ ├── cat.json
│ ├── Dog.json
│ ├── hotair.png
│ └── toggle.json
│
├── components/ # Reusable components
│ ├── BottomTab.js
│ ├── CalenderHeader.js
│ ├── CalenderSelector.js
│ ├── TaskLists.js
│ ├── TaskManager.js
│ └── ToggleButton.js
│
├── screens/ # App screens
│ ├── LoginScreens.js
│ ├── NameScreen.js
│ ├── ProfileScreen.js
│ ├── RemainderScreen.js
│ ├── SigninScreen.js
│ ├── TodoScreen.js
│ └── WelcomeScreen.js
│
├── App.js # App entry point
├── firebaseConfig.js # Firebase setup
├── index.js # Main index file
└── package-lock.json

---

## ⚙️ Firebase Setup

Create a project in [Firebase Console](https://console.firebase.google.com) and enable:

- 🔑 Authentication → Email/Password
- 🔥 Firestore Database
- ☁️ Firebase Storage 

In `firebaseConfig.js`:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-app.firebaseapp.com',
  projectId: 'your-app',
  storageBucket: 'your-app.appspot.com',
  messagingSenderId: '...',
  appId: '...'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
💡 Key Screens and Logic
🔐 Authentication
LoginScreens.js & SigninScreen.js: Handles Firebase sign-in and sign-up with validation.

📝 Name Entry & Storage
NameScreen.js: Stores user’s name in Firestore and caches it in AsyncStorage.

📅 To-Do Functionality
TodoScreen.js: Displays calendar and task list

TaskLists.js & TaskManager.js: Add/delete tasks for selected dates

🎨 Theme Toggle
ToggleButton.js: Uses React Context to toggle light/dark mode

👤 Profile Management
ProfileScreen.js:

Displays name and email

Upload profile photo to Firebase Storage

Fetches from Firestore and caches using AsyncStorage

Allows logout and name editing

🧪 Running the App
bash
npm install
npx expo start
Scan the QR code with Expo Go

Try sign-up, theme toggle, adding tasks, and uploading profile photo!

🔐 Firebase Storage Rules (for development)
js
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}

👩‍💻 Author
Preksha

📄 License
MIT License. Feel free to fork, learn, or extend this app!
---
Let me know if you'd like me to generate this into a downloadable file or push it into your project folder.
