# To-Do App (React Native + Firebase)

A calendar-based To-Do mobile application built using **React Native** and **Firebase**, designed with a beautiful UI and clean user experience. Users can sign up, manage tasks by date, toggle themes, and personalize their profile with a photo and name.

---

## Features

- Email/Password Authentication (Firebase Auth)
- Expandable Calendar for Date-Based Task Management
- Persistent Tasks Stored in Firestore
- Light/Dark Theme Toggle (via Context API)
- Profile Page with Editable Name & Uploadable Image (Firebase Storage)
- Built with Expo for easy development and preview

---

## Project Structure

```
todo-app/
├── assets/                  # Static assets (JSON, PNGs, etc.)
├── components/             # Shared UI components
│   ├── BottomTab.js
│   ├── CalendarHeader.js
│   ├── CalendarSelector.js
│   ├── TaskList.js
│   ├── TaskManager.js
│   └── ToggleButton.js
├── screens/                # Main app screens
│   ├── LoginScreens.js
│   ├── NameScreen.js
│   ├── ProfileScreen.js
│   ├── RemainderScreen.js
│   ├── SigninScreen.js
│   ├── TodoScreen.js
│   └── WelcomeScreen.js
├── firebaseConfig.js       # Firebase SDK configuration
├── App.js                  # Entry point and navigation
├── package.json
└── README.md               # Project documentation
```

---

## Tech Stack

- **React Native** with Expo (for development & preview)
- **Firebase**:
  - Firestore (task and profile storage)
  - Authentication (email/password)
  - Storage (profile picture uploads)
- **React Navigation** (stack & bottom tabs)
- **AsyncStorage** (for local caching)
- **Context API** (for theme management)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/todo-app.git
cd todo-app
```

### 2. Install Dependencies

Make sure you have Node.js and Expo CLI installed. Then:

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

---

### 3. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project (or use an existing one)
3. Enable:
   - **Authentication → Email/Password**
   - **Firestore Database** (in test mode or add rules)
   - **Storage** (you must be on the **Blaze Plan** to enable uploads)

4. In your Firebase project, go to Project Settings → General → Add app (Web)
5. Copy the Firebase config and replace it in `firebaseConfig.js`:

```js
// firebaseConfig.js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};
```

---

### 4. Run the App with Expo

```bash
npx expo start
```

- Scan the QR code with your phone using the **Expo Go app**
- Or open in Android/iOS emulator

---

## Optional Commands

```bash
# To reset local cache:
npx expo start --clear

# To build for Android/iOS (after finishing dev)
npx expo build:android
npx expo build:ios
```

---

## Author

**Preksha**  
[GitHub](https://github.com/Prekshaaaaaaaa)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributions

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---
