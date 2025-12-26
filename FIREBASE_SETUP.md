# Firebase iOS Setup Guide

## ✅ Dependencies Already Installed
Your project already has Firebase packages:
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/database`
- `@react-native-firebase/firestore`

## 🔥 Setup Steps

### Step 1: Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click "Add project"
3. Name: `mobile-todo-app`
4. Enable Analytics (optional)
5. Create project

### Step 2: Add iOS App
1. In Firebase Console, click iOS icon
2. **iOS Bundle ID:** `org.reactjs.native.example.MobileTodoList`
3. **App nickname:** Mobile Todo List iOS
4. Download `GoogleService-Info.plist`

### Step 3: Add GoogleService-Info.plist to Xcode
1. Open file in Finder (Downloads folder)
2. In Xcode (already open), right-click on `MobileTodoList` folder
3. Select "Add Files to MobileTodoList..."
4. Select `GoogleService-Info.plist`
5. **CHECK:** "Copy items if needed"
6. **CHECK:** Add to target "MobileTodoList"
7. Click Add

### Step 4: Update .env with Firebase Config
After adding the plist file, open it and copy these values to `.env`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key
```

### Step 5: Enable Firebase Services
In Firebase Console:
1. **Firestore Database:** 
   - Go to Firestore Database
   - Create database
   - Start in test mode (for development)

2. **Authentication:**
   - Go to Authentication
   - Enable Email/Password
   - Enable Anonymous

3. **Realtime Database:**
   - Go to Realtime Database
   - Create database
   - Start in test mode

### Step 6: Install CocoaPods Dependencies
Run in terminal:
```bash
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS/ios
pod install
```

## ✅ What This Enables

Once Firebase is configured, your app gets:
- ✅ Real-time shared shopping lists
- ✅ Live collaboration with family/friends
- ✅ Cloud sync across devices
- ✅ User authentication
- ✅ Offline data persistence
- ✅ Push notifications (when configured)

## 🎯 Quick Test

After setup, the app will automatically:
- Connect to Firebase on launch
- Sync lists to the cloud
- Enable real-time updates

No code changes needed - it's all configured! 🚀
