# Quick Start: Set App Icon to TTelGo Logo

## Fastest Method (5 minutes)

### Step 1: Prepare Your Logo
1. Make sure you have the TTelGo logo image (red background, white logo)
2. Ensure it's square (1024x1024px recommended)

### Step 2: Use Online Generator (Easiest)
1. Go to: **https://www.appicon.co/** or **https://icon.kitchen/**
2. Upload your TTelGo logo (1024x1024px)
3. Select "React Native" as platform
4. Download generated icons
5. Extract the zip file

### Step 3: Replace Android Icons
1. Copy icons from downloaded `android` folder
2. Replace files in: `android/app/src/main/res/`
   - Replace icons in each mipmap folder:
     - `mipmap-mdpi/` → 48x48 icons
     - `mipmap-hdpi/` → 72x72 icons
     - `mipmap-xhdpi/` → 96x96 icons
     - `mipmap-xxhdpi/` → 144x144 icons
     - `mipmap-xxxhdpi/` → 192x192 icons
   - Replace both `ic_launcher.png` and `ic_launcher_round.png` in each folder

### Step 4: Replace iOS Icons
1. Open: `ios/MyApp/Images.xcassets/AppIcon.appiconset/`
2. Copy icons from downloaded `ios` folder
3. Replace all icon files in the AppIcon.appiconset folder

### Step 5: Test
```bash
# For Android
cd android
.\gradlew.bat clean assembleRelease

# For iOS (in Xcode)
# Open ios/MyApp.xcworkspace and build
```

## What You Need
- ✅ TTelGo logo image (1024x1024px, PNG format)
- ✅ 10 minutes of time
- ✅ Access to appicon.co or icon.kitchen website

## Icon Requirements
- Format: PNG
- Background: Red (#CC0000) with white logo
- Shape: Square (will be auto-rounded on devices)
- Padding: 10-15% margin around logo

## Troubleshooting

**Icons not showing?**
- Make sure you replaced icons in ALL mipmap folders
- Clean build: `cd android && gradlew.bat clean`
- Rebuild the app

**Icon looks blurry?**
- Ensure you're using correct sizes for each density
- Verify 1024x1024 source image is high quality

**Build errors?**
- Check icon filenames match exactly (ic_launcher.png)
- Ensure all required sizes are present

## After Setup
Your app icon will display the TTelGo logo on:
- ✅ Home screen
- ✅ App drawer
- ✅ Recent apps
- ✅ App Store/Play Store (after publishing)










