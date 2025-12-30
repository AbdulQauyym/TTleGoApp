@echo off
echo ========================================
echo Fixing Metro Bundler Connection Issue
echo ========================================
echo.

echo Step 1: Setting up ADB reverse for USB devices...
adb reverse tcp:8081 tcp:8081
if %errorlevel% equ 0 (
    echo [OK] ADB reverse configured successfully
) else (
    echo [WARNING] ADB reverse failed. Make sure your device is connected via USB.
    echo If you're using Wi-Fi, make sure your device is on the same network.
)
echo.

echo Step 2: Starting Metro Bundler...
echo Please keep this window open and start Metro in a new terminal.
echo.
echo To start Metro, run: npm start
echo Or: npx react-native start
echo.
echo ========================================
echo IMPORTANT: 
echo 1. Keep Metro bundler running
echo 2. Make sure your device/emulator is connected
echo 3. Reload the app (press R twice or shake device)
echo ========================================
echo.

pause

