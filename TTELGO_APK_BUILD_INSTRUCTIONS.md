# TTelGo APK Build Instructions

## ✅ What Has Been Configured

1. **App Name**: Updated to "TTelGo" in all configuration files
   - `app.json`
   - `android/app/src/main/res/values/strings.xml`
   - `android/app/src/main/java/com/myapp/MainActivity.kt`
   - `ios/MyApp/Info.plist`

2. **App Icon**: Set to use `src/assets/2.png`
   - Icon copied to all Android mipmap folders
   - Will display as the app icon on device

## 🚀 Building the APK

### Option 1: Use the Build Script (Recommended)
Double-click or run:
```
BUILD_TTELGO_APK.bat
```

This script will:
1. Set up the app icon
2. Clean previous builds
3. Build the release APK

### Option 2: Quick Build (If icon already set up)
Double-click or run:
```
BUILD_TTELGO_APK_QUICK.bat
```

### Option 3: Manual Build
Open PowerShell/Command Prompt in the project root and run:
```bash
cd android
gradlew.bat clean
gradlew.bat assembleRelease
```

## 📱 APK Location

After successful build, the APK will be located at:
```
android\app\build\outputs\apk\release\app-release.apk
```

## 📋 App Details

- **App Name**: TTelGo
- **Package Name**: com.myapp
- **Version**: 1.0
- **Icon**: src/assets/2.png (TTelGo logo with red background)

## ⚠️ Important Notes

1. **Build Time**: The first build may take 5-15 minutes depending on your system
2. **Icon Sizes**: The icon has been copied to all required sizes. For best results, you may want to manually resize `2.png` to these exact sizes:
   - mipmap-mdpi: 48x48px
   - mipmap-hdpi: 72x72px
   - mipmap-xhdpi: 96x96px
   - mipmap-xxhdpi: 144x144px
   - mipmap-xxxhdpi: 192x192px

3. **Installation**: To install the APK on a device:
   ```bash
   adb install android\app\build\outputs\apk\release\app-release.apk
   ```

## 🔧 Troubleshooting

If the build fails:
1. Make sure you have Java JDK installed
2. Check that Android SDK is properly configured
3. Ensure all dependencies are installed: `npm install`
4. Try cleaning first: `cd android && gradlew.bat clean`

## ✅ Verification

After building, verify:
- APK file exists in the output directory
- APK size is reasonable (typically 30-50 MB for React Native apps)
- App name shows as "TTelGo" when installed
- App icon displays correctly (red background with TTelGo logo)




