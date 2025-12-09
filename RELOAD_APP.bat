@echo off
echo ========================================
echo Reloading React Native App
echo ========================================
echo.

echo Killing existing Metro bundler processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Starting Metro bundler...
start "Metro Bundler" cmd /k "npx react-native start --reset-cache"

echo.
echo Waiting 8 seconds for Metro to start...
timeout /t 8 /nobreak >nul

echo.
echo Installing and running app on emulator...
call npx react-native run-android

echo.
echo ========================================
echo App reloaded!
echo ========================================
echo.
echo If the app still doesn't work:
echo 1. Check the emulator screen for errors
echo 2. Press 'R' twice in the Metro bundler window to reload
echo 3. Shake the emulator device and select "Reload"
echo.
pause








