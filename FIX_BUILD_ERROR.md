# Fix Android Build Error

## Error Message
```
BUILD FAILED in 47s
error Failed to install the app. Make sure you have an Android emulator running or a device connected.
```

## Step-by-Step Fix

### Step 1: Check if Emulator/Device is Running

**Option A: Check via Android Studio**
1. Open Android Studio
2. Go to Tools > Device Manager
3. Start an emulator or connect a physical device
4. Wait for it to fully boot

**Option B: Check via Command Line**
```powershell
# Navigate to Android SDK platform-tools (adjust path if needed)
cd $env:LOCALAPPDATA\Android\Sdk\platform-tools
.\adb devices
```

You should see your device/emulator listed.

### Step 2: Clean Build Cache

```powershell
cd C:\Users\abdul\Downloads\ReatNative\MyApp

# Clean Metro bundler cache
npx react-native start --reset-cache

# In a NEW terminal, clean Android build
cd android
.\gradlew clean
cd ..
```

### Step 3: Rebuild the App

```powershell
# Make sure Metro bundler is running in one terminal
# Then in another terminal:
npx react-native run-android
```

### Step 4: If Still Failing - Check Gradle

```powershell
cd android
.\gradlew --version
.\gradlew clean
cd ..
```

### Step 5: Reinstall Dependencies

```powershell
# Clean node modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install

# For Android
cd android
.\gradlew clean
cd ..
```

## Common Issues & Solutions

### Issue 1: No Emulator Running
**Solution:** Start an Android emulator from Android Studio

### Issue 2: Port 8081 Already in Use
**Solution:**
```powershell
# Kill process on port 8081
netstat -ano | findstr :8081
taskkill /PID <PID_NUMBER> /F
```

### Issue 3: Gradle Build Failed
**Solution:**
```powershell
cd android
.\gradlew clean
.\gradlew assembleDebug
cd ..
```

### Issue 4: Metro Bundler Not Running
**Solution:**
```powershell
npx react-native start --reset-cache
```

## Quick Fix Script

Run these commands in order:

```powershell
# 1. Stop Metro bundler (Ctrl+C if running)

# 2. Clean everything
cd C:\Users\abdul\Downloads\ReatNative\MyApp
Remove-Item -Recurse -Force android\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\app\build -ErrorAction SilentlyContinue

# 3. Clean Gradle
cd android
.\gradlew clean
cd ..

# 4. Start Metro bundler (in one terminal)
npx react-native start --reset-cache

# 5. In another terminal, run Android
npx react-native run-android
```

## Still Not Working?

1. Check Android Studio for emulator status
2. Verify Android SDK is properly installed
3. Check if JAVA_HOME is set correctly
4. Share the full error log from the build output


