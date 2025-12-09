@echo off
echo ========================================
echo Fixing and Running React Native App
echo ========================================
echo.

echo Step 1: Stopping all Metro bundlers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Cleaning Android build...
cd android
call gradlew.bat clean
cd ..

echo.
echo Step 3: Clearing Metro cache...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist ".metro" rmdir /s /q ".metro"

echo.
echo Step 4: Starting Metro bundler in background...
start "Metro Bundler" cmd /k "npx react-native start --reset-cache"

echo.
echo Step 5: Waiting for Metro to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

echo.
echo Step 6: Building and installing app...
call npx react-native run-android

echo.
echo ========================================
echo Done! Check the emulator now.
echo ========================================
echo.
echo If the app still doesn't launch:
echo 1. Check the Metro bundler window for errors
echo 2. Press Ctrl+M on emulator to open dev menu
echo 3. Select "Reload" from the menu
echo.
pause








