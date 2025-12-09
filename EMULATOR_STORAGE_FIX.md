# Fixing Emulator Storage Error

## Error Message
```
NullPointerException: Attempt to invoke virtual method 'void android.content.pm.PackageManagerInternal.freeStorage'
```

This error means the emulator has a storage allocation issue.

## Solutions (Try in Order)

### Solution 1: Wipe Emulator Data (Easiest)
1. Open **Android Studio**
2. Go to **Tools → Device Manager**
3. Find your emulator (Medium_Phone)
4. Click the **dropdown arrow** (▼) next to it
5. Select **"Wipe Data"**
6. Click **"Cold Boot Now"** to restart
7. Wait for emulator to fully boot
8. Run: `npx react-native run-android`

### Solution 2: Cold Boot Emulator
1. Open **Android Studio**
2. Go to **Tools → Device Manager**
3. Click dropdown arrow next to emulator
4. Select **"Cold Boot Now"**
5. Wait for emulator to boot
6. Run: `npx react-native run-android`

### Solution 3: Increase Emulator Storage
1. Open **Android Studio**
2. Go to **Tools → Device Manager**
3. Click **Edit** (pencil icon) next to emulator
4. Click **Show Advanced Settings**
5. Increase **Internal Storage** to at least 2GB
6. Click **Finish**
7. Wipe data and restart emulator

### Solution 4: Create New Emulator
1. Open **Android Studio**
2. Go to **Tools → Device Manager**
3. Click **Create Device**
4. Choose a device (e.g., Pixel 5)
5. Select system image (API 33 or 34)
6. Click **Show Advanced Settings**
7. Set **Internal Storage**: 2GB or more
8. Click **Finish**
9. Start the new emulator
10. Run: `npx react-native run-android`

### Solution 5: Use Physical Device (Fastest)
1. Connect Android phone via USB
2. Enable **USB Debugging** on phone
3. Run: `npx react-native run-android`

## Quick Fix Script
Run: `FIX_EMULATOR_ISSUES.bat`

## After Fixing
Once emulator is working:
```bash
npx react-native run-android
```

## Alternative: Build APK Only
If emulator keeps having issues, build APK without installing:
```bash
cd android
gradlew.bat assembleDebug
```
Then manually install the APK by dragging it onto the emulator.



