# How to See Your Changes in the Emulator

## Quick Steps to See Updates

### Step 1: Make Sure Metro Bundler is Running
Metro bundler must be running for Fast Refresh to work. Check if you see a terminal window with Metro running.

If not running, open a terminal and run:
```powershell
npm start
```

### Step 2: Reload the App
You have several options:

#### Option A: Press R Twice (Easiest)
1. Find the Metro bundler terminal window
2. Press `R` key **twice** (press R, then press R again)
3. App will reload with your changes

#### Option B: Use Developer Menu on Emulator
1. On the emulator, press `Ctrl+M` (Windows) or `Cmd+M` (Mac)
2. A menu will appear
3. Tap **"Reload"**
4. App will reload

#### Option C: Shake Gesture (Alternative)
1. On emulator, press `Ctrl+M` to open dev menu
2. Select "Reload"

### Step 3: Navigate to the Updated Screens
After reloading, you need to navigate to the screens you changed:

1. **For Terms & Conditions:**
   - Go to Profile tab
   - Find and tap "Terms & Conditions"
   - You should see the new content

2. **For Notifications:**
   - Tap the notification bell icon in the header (top right)
   - You should see the empty state

## If Changes Still Don't Appear

### Try Full Reload
1. Stop Metro bundler (press `Ctrl+C` in Metro terminal)
2. Restart Metro: `npm start`
3. Reload app: Press `R` twice in Metro terminal

### Check for Errors
Look at the Metro bundler terminal for any red error messages. Fix any syntax errors.

### Verify Files Were Saved
Make sure you saved the files in your IDE (Ctrl+S)

## Troubleshooting

### Metro Not Running?
```powershell
npm start
```

### App Not Connected to Metro?
- Check Metro terminal shows "Metro waiting on port 8081"
- Check emulator is running
- Try reloading: Press `R` twice

### Still Not Working?
Try a full rebuild:
```powershell
npm run android
```

But this should NOT be necessary for code changes - Fast Refresh should handle it!

