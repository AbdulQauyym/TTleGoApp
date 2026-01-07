# How to Run Your React Native App on Android Emulator

## Quick Steps

### Step 1: Start the Emulator
1. In Android Studio, go to **Device Manager** (or **Tools → Device Manager**)
2. Find your **Google Pixel 5** device
3. Click the **▶ Play button** to start the emulator
4. Wait for the emulator to fully boot (you'll see the Android home screen)

### Step 2: Run Your App
Once the emulator is running, open a terminal in your project and run:

```powershell
npm run android
```

That's it! React Native will:
- Build your app automatically
- Install it on the emulator
- Launch it
- Connect to the Metro bundler (which should already be running)

---

## Important Notes

### ✅ Make Sure Metro Bundler is Running
The Metro bundler should already be running on `localhost:8081` (I started it earlier). If not, run:
```powershell
npm start
```

### ✅ Keep Metro Bundler Running
Keep the Metro bundler terminal open while developing. This serves your JavaScript code.

### ✅ If You See Errors
- **"Unable to connect to Metro"**: Make sure Metro bundler is running (`npm start`)
- **"Build failed"**: Check the error messages - common issues are missing dependencies or SDK issues
- **"Device not found"**: Make sure the emulator is fully started (you see the home screen)

---

## What Happens When You Run `npm run android`?

1. ✅ Checks if emulator/device is connected
2. ✅ Builds the Android app (creates APK internally)
3. ✅ Installs the APK on your emulator
4. ✅ Launches the app
5. ✅ Connects to Metro bundler for hot reloading

**You don't need to manually create or install an APK - React Native does it all!**

---

## After Running the App

Once the app is running:
- **Press `R` twice** in Metro bundler terminal to reload
- **Press `Ctrl+M`** (or `Cmd+M` on Mac) on emulator to open developer menu
- **Shake gesture** on emulator (Ctrl+M → Shake) opens dev menu
- Edit your code and save - it will auto-reload!

---

## Next Steps After Installation

After Android Studio installation, make sure:
1. ✅ Android SDK is installed (usually done automatically)
2. ✅ Emulator is set up (✅ you have Pixel 5)
3. ✅ Start the emulator
4. ✅ Run `npm run android`

You're all set! 🚀

