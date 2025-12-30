# Fix "Unable to load script" Error

This error occurs when your React Native app cannot connect to the Metro bundler. Follow these steps to fix it:

## Quick Fix Steps

### Option 1: Using the Automated Script (Recommended)

1. **Run the fix script:**
   ```bash
   START_METRO_AND_RUN.bat
   ```
   This will:
   - Set up ADB reverse port forwarding (for USB devices)
   - Start Metro bundler
   - Run your Android app

### Option 2: Manual Fix

#### Step 1: Start Metro Bundler
Open a terminal and run:
```bash
npm start
```
or
```bash
npx react-native start
```

**Keep this terminal open** - Metro bundler must be running for your app to work.

#### Step 2: Set up ADB Reverse (For USB Connected Devices)

If you're using a **physical device connected via USB**, run:
```bash
adb reverse tcp:8081 tcp:8081
```

**Note:** If `adb` is not recognized, you need to:
1. Find your Android SDK path (usually in `%LOCALAPPDATA%\Android\Sdk\platform-tools`)
2. Add it to your PATH, or
3. Use the full path: `C:\Users\YourUsername\AppData\Local\Android\Sdk\platform-tools\adb.exe reverse tcp:8081 tcp:8081`

#### Step 3: Reload the App

After Metro is running:
- **On Emulator:** Press `R` twice in the Metro bundler terminal, or press `Ctrl+M` and select "Reload"
- **On Physical Device:** Shake the device and tap "Reload"

### Option 3: For Wi-Fi Connected Devices

If your device is connected via Wi-Fi (not USB):

1. Make sure your device and computer are on the **same Wi-Fi network**
2. Find your computer's IP address:
   - Windows: Run `ipconfig` and look for "IPv4 Address"
   - Usually something like `192.168.1.xxx`
3. In the Metro bundler terminal, you'll see a message like:
   ```
   Metro waiting on exp://192.168.1.xxx:8081
   ```
4. On your device, shake it and select "Settings" → Enter your computer's IP address

## Troubleshooting

### Metro Bundler Won't Start
- Make sure port 8081 is not in use by another application
- Try: `npx react-native start --reset-cache`

### Still Getting the Error
1. **Clear cache and restart:**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Rebuild the app:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

3. **Check your network:**
   - Ensure firewall isn't blocking port 8081
   - For USB: Make sure USB debugging is enabled on your device

4. **Verify Metro is accessible:**
   - Open browser and go to: `http://localhost:8081/status`
   - You should see: `{"status":"running"}`

## Common Issues

### "ADB not recognized"
- Install Android SDK Platform Tools
- Or use the full path to adb.exe

### "Metro bundler already running"
- Close the existing Metro bundler process
- Or use a different port: `npx react-native start --port 8082`

### App still shows error after following steps
- Make sure you're running in **debug mode** (not release)
- Check that `android/app/build.gradle` has `debug` build type configured
- Try uninstalling and reinstalling the app on your device

