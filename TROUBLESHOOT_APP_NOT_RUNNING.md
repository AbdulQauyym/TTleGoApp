# Troubleshooting: App Installed But Not Running

## What to Check:

### 1. Check the Emulator Screen
- **Red Error Screen?** → JavaScript error, check Metro bundler window
- **Blank/White Screen?** → Bundle not loading or navigation error
- **App Icon Visible?** → Try tapping it manually

### 2. Check Metro Bundler Window
Look for:
- Red error messages
- "BUNDLE" loading messages
- Connection errors
- Syntax errors

### 3. Manual Steps:

#### Step A: Open Dev Menu
- Press `Ctrl+M` (or `Cmd+M` on Mac) on the emulator
- Or shake the emulator device
- Select **"Reload"** from the menu

#### Step B: Check Metro Bundler
Make sure you see:
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Metro waiting on port 8081                                                 │
│  To reload the app press "r"                                                │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Step C: Reload the App
In the Metro bundler window, press:
- `R` twice (reload)
- Or `Ctrl+C` then restart with `npx react-native start`

### 4. Common Issues:

#### Issue: "Unable to load script"
**Solution:**
1. Make sure Metro bundler is running: `npx react-native start`
2. Check if port 8081 is accessible
3. Restart Metro: `npx react-native start --reset-cache`

#### Issue: Red Error Screen
**Solution:**
1. Check the error message on the emulator
2. Look for the error in Metro bundler window
3. Fix the JavaScript error
4. Press `R` in Metro window to reload

#### Issue: App Crashes Immediately
**Solution:**
1. Check Android logs: `adb logcat | findstr ReactNative`
2. Check for missing dependencies
3. Verify all imports are correct

### 5. Force Reload App:
```bash
# 1. Stop all processes
taskkill /F /IM node.exe

# 2. Start Metro
npx react-native start --reset-cache

# 3. In another terminal, reload app
npx react-native run-android
```

### 6. Still Not Working?
1. Check emulator screen - what do you see?
2. Check Metro bundler window - any errors?
3. Try opening dev menu (Ctrl+M) and select "Reload"
4. Manually tap the app icon on emulator








