# Voice Search Feature Setup

## Overview
Voice search functionality has been added to the homepage search box. Users can now tap the microphone icon to search using their voice.

## What Was Added

1. **Microphone Button**: Added a microphone icon button next to the search input field
2. **Speech Recognition**: Integrated `@react-native-voice/voice` library for speech-to-text conversion
3. **Permission Handling**: Automatic microphone permission requests for Android
4. **Visual Feedback**: Recording indicator shows when voice recognition is active

## Features

- Tap the microphone icon to start voice search
- Speak your search query
- The recognized text automatically populates the search box
- Tap the microphone again to stop recording
- Visual indicator shows when recording is active (red dot)

## Installation

The voice library has been installed:
```bash
npm install @react-native-voice/voice
```

## Build Configuration Fix

**Important**: The `@react-native-voice/voice` library had build configuration issues that have been fixed in `node_modules/@react-native-voice/voice/android/build.gradle`:

- Replaced deprecated `jcenter()` with `mavenCentral()` and `google()`
- Fixed compileSdk configuration

**Note**: These changes in `node_modules` will be lost if you run `npm install` again. To persist the changes:

1. Install patch-package:
   ```bash
   npm install --save-dev patch-package
   ```

2. Create a patch:
   ```bash
   npx patch-package @react-native-voice/voice
   ```

3. Add to package.json scripts:
   ```json
   "postinstall": "patch-package"
   ```

## Rebuild Required

After installing the library, you need to rebuild the Android app:

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Permissions

The app already has microphone permission in `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

For iOS, you'll need to add to `Info.plist`:
```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for voice search</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition for voice search</string>
```

## Usage

1. Tap the microphone icon in the search box
2. Grant microphone permission if prompted (first time only)
3. Speak your search query clearly
4. The recognized text will appear in the search box
5. Tap the microphone again to stop recording

## Troubleshooting

### Build Errors
If you encounter build errors after `npm install`, reapply the build.gradle fixes or use patch-package as described above.

### Permission Issues
- Make sure `RECORD_AUDIO` permission is in AndroidManifest.xml
- For iOS, add the required keys to Info.plist
- Check device settings if permission is denied

### Voice Recognition Not Working
- Check that microphone permission is granted
- Ensure you're speaking clearly
- Try in a quiet environment
- Check console logs for error messages

## Language Support

Currently set to English (en-US). To change the language, modify the `Voice.start()` call in `homepage.js`:

```javascript
await Voice.start('es-ES'); // Spanish
await Voice.start('fr-FR'); // French
// etc.
```

Available languages can be checked with:
```javascript
const languages = await Voice.getSupportedLanguages();
console.log(languages);
```

