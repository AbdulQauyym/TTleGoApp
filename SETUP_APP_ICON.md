# App Icon Setup Guide

## Overview
This guide will help you set the TTelGo logo as your app icon for both Android and iOS platforms.

## Prerequisites
- Your TTelGo logo image (1024x1024px recommended)
- Image editing tool (Photoshop, GIMP, or online tools)

## Step 1: Prepare Your Logo Image

1. **Source Image Requirements:**
   - Size: 1024x1024 pixels (square)
   - Format: PNG with transparency OR solid red background with white logo
   - The logo should be centered and have some padding around it (about 10-15% margin)

2. **Save your master icon as:** `app_icon_1024x1024.png` in the project root

## Step 2: Generate Required Icon Sizes

### For Android:
You need icons in these sizes:
- `mipmap-mdpi`: 48x48px (ic_launcher.png, ic_launcher_round.png)
- `mipmap-hdpi`: 72x72px
- `mipmap-xhdpi`: 96x96px
- `mipmap-xxhdpi`: 144x144px
- `mipmap-xxxhdpi`: 192x192px

### For iOS:
You need icons in these sizes:
- 40x40px (20pt@2x)
- 60x60px (20pt@3x)
- 58x58px (29pt@2x)
- 87x87px (29pt@3x)
- 80x80px (40pt@2x)
- 120x120px (40pt@3x)
- 120x120px (60pt@2x)
- 180x180px (60pt@3x)
- 1024x1024px (App Store)

## Step 3: Use Online Tools or Scripts

### Option A: Using Online Tools
1. Visit: https://www.appicon.co/ or https://icon.kitchen/
2. Upload your 1024x1024px logo
3. Generate all sizes for Android and iOS
4. Download and extract

### Option B: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first, then run:
convert app_icon_1024x1024.png -resize 192x192 android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
convert app_icon_1024x1024.png -resize 144x144 android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
convert app_icon_1024x1024.png -resize 96x96 android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
convert app_icon_1024x1024.png -resize 72x72 android/app/src/main/res/mipmap-hdpi/ic_launcher.png
convert app_icon_1024x1024.png -resize 48x48 android/app/src/main/res/mipmap-mdpi/ic_launcher.png
```

## Step 4: Replace Android Icons

1. Navigate to: `android/app/src/main/res/`
2. Replace icons in each mipmap folder:
   - `mipmap-mdpi/ic_launcher.png` → 48x48px
   - `mipmap-mdpi/ic_launcher_round.png` → 48x48px (same as above)
   - `mipmap-hdpi/ic_launcher.png` → 72x72px
   - `mipmap-hdpi/ic_launcher_round.png` → 72x72px
   - `mipmap-xhdpi/ic_launcher.png` → 96x96px
   - `mipmap-xhdpi/ic_launcher_round.png` → 96x96px
   - `mipmap-xxhdpi/ic_launcher.png` → 144x144px
   - `mipmap-xxhdpi/ic_launcher_round.png` → 144x144px
   - `mipmap-xxxhdpi/ic_launcher.png` → 192x192px
   - `mipmap-xxxhdpi/ic_launcher_round.png` → 192x192px

## Step 5: Replace iOS Icons

1. Navigate to: `ios/MyApp/Images.xcassets/AppIcon.appiconset/`
2. Replace icons with these sizes:
   - `icon-20@2x.png` → 40x40px
   - `icon-20@3x.png` → 60x60px
   - `icon-29@2x.png` → 58x58px
   - `icon-29@3x.png` → 87x87px
   - `icon-40@2x.png` → 80x80px
   - `icon-40@3x.png` → 120x120px
   - `icon-60@2x.png` → 120x120px
   - `icon-60@3x.png` → 180x180px
   - `icon-1024.png` → 1024x1024px

## Step 6: Verify Installation

### Android:
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### iOS:
1. Open `ios/MyApp.xcworkspace` in Xcode
2. Select the project in the navigator
3. Select the app target
4. Go to "General" tab
5. Verify icons appear in the App Icons section

## Quick Reference: Icon Sizes

### Android
| Density | Size | Folder |
|---------|------|--------|
| mdpi | 48x48 | mipmap-mdpi |
| hdpi | 72x72 | mipmap-hdpi |
| xhdpi | 96x96 | mipmap-xhdpi |
| xxhdpi | 144x144 | mipmap-xxhdpi |
| xxxhdpi | 192x192 | mipmap-xxxhdpi |

### iOS
| Scale | Size | Filename |
|-------|------|----------|
| 2x | 40x40 | icon-20@2x.png |
| 3x | 60x60 | icon-20@3x.png |
| 2x | 58x58 | icon-29@2x.png |
| 3x | 87x87 | icon-29@3x.png |
| 2x | 80x80 | icon-40@2x.png |
| 3x | 120x120 | icon-40@3x.png |
| 2x | 120x120 | icon-60@2x.png |
| 3x | 180x180 | icon-60@3x.png |
| 1x | 1024x1024 | icon-1024.png |

## Notes
- Always use PNG format for icons
- Ensure icons have no rounded corners (Android system applies them automatically)
- Test icons on actual devices to verify they look good
- Keep original 1024x1024px file for future updates










