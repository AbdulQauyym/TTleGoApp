# WHITE SCREEN DEBUG GUIDE

## What White Screen Means
A white screen means the app is crashing **before** it can render anything.

## Steps to Debug:

### Step 1: Check Metro Bundler
Look at your Metro bundler terminal window and check for:
- RED error messages
- Any JavaScript errors
- Import errors
- Syntax errors

### Step 2: Try Minimal App
I've created `App.simple.js` - a minimal test app.

To test it:
1. Backup current App.js: `Move-Item App.js App.original.js`
2. Use simple version: `Move-Item App.simple.js App.js`
3. Reload the app (press R twice in Metro bundler)
4. If you see red screen with text "App is working!" - basic rendering works
5. If still white screen - there's a deeper issue

### Step 3: Check Common Issues

1. **Metro Bundler Not Running**
   - Run: `npx react-native start --reset-cache`
   - Wait for "Metro waiting on port 8081"

2. **Component Import Error**
   - One of the imported components might be crashing
   - Check which component is imported first

3. **Missing Dependencies**
   - Check if all packages are installed: `npm install`

4. **Navigation Error**
   - NavigationContainer might be failing
   - Try without navigation first

### Step 4: Share Error Messages
Please copy and share:
- Any error messages from Metro bundler
- Any red screen error text
- The exact line number of errors

## Quick Fix Test
Run this command to test minimal app:
```
cd C:\Users\abdul\Downloads\ReatNative\MyApp
Move-Item App.js App.backup.js
Copy-Item App.simple.js App.js
```
Then reload the app.






