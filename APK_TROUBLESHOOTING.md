# APK Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: App Crashes on Startup
**Cause:** ProGuard removing React Native code or missing JavaScript bundle

**Solution:**
1. I've already added proper ProGuard rules to `android/app/proguard-rules.pro`
2. Rebuild the APK using the build script: `build_release_apk_fixed.bat`

### Issue 2: "Unable to load script" Error
**Cause:** JavaScript bundle not included in APK

**Solution:**
- The release build automatically includes the JS bundle
- Make sure you're using a **release** APK, not a debug APK
- Debug APKs require Metro bundler to be running

### Issue 3: App Opens but Shows Blank Screen
**Possible Causes:**
1. Missing assets/images
2. Navigation errors
3. JavaScript errors

**Solution:**
- Check device logs: `adb logcat | grep -i "ReactNative\|Error"`
- Make sure all images are properly required in code
- Check if there are any console errors

### Issue 4: App Installs but Won't Open
**Possible Causes:**
1. App crash on startup
2. Missing permissions
3. Incompatible Android version

**Solution:**
1. Check crash logs: `adb logcat *:E`
2. Verify minSdkVersion in `build.gradle` matches your device
3. Check AndroidManifest.xml for required permissions

## Steps to Build a Working Release APK

1. **Clean previous builds:**
   ```bash
   cd android
   gradlew.bat clean
   ```

2. **Build release APK:**
   ```bash
   gradlew.bat assembleRelease
   ```
   OR use the batch script:
   ```bash
   build_release_apk_fixed.bat
   ```

3. **Install on device:**
   - Uninstall old version first
   - Install new APK: `adb install android/app/build/outputs/apk/release/app-release.apk`

## Checking if APK is Correct

1. **APK should be 30-50 MB** (includes JS bundle and assets)
2. **APK should work without Metro bundler running**
3. **Check logs for errors:**
   ```bash
   adb logcat | grep -i "ReactNative"
   ```

## If App Still Doesn't Work

1. **Check device logs:**
   ```bash
   adb logcat *:E | grep -i "myapp\|ReactNative"
   ```

2. **Try disabling ProGuard temporarily:**
   - In `android/app/build.gradle`, change:
     ```gradle
     minifyEnabled false  // Temporarily disable
     ```

3. **Verify JavaScript bundle is included:**
   - Extract APK (rename to .zip)
   - Check for `index.android.bundle` or `index.bundle` in `assets/`

4. **Check for missing dependencies:**
   - Make sure all native modules are properly linked
   - Check `android/settings.gradle` for all modules







