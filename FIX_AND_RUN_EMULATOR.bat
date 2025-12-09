@echo off
echo ========================================
echo Fixing Emulator Issues and Running App
echo ========================================
echo.

echo Step 1: Stopping old processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM qemu-system-x86_64.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Done.
echo.

echo Step 2: Starting Metro Bundler with cache reset...
start "Metro Bundler" cmd /k "npx react-native start --reset-cache"
timeout /t 5 /nobreak
echo Metro bundler started in separate window.
echo.

echo Step 3: Waiting for Metro to be ready...
timeout /t 10 /nobreak
echo.

echo Step 4: Running app on Android emulator...
echo This will build and install the app...
echo.

npx react-native run-android

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo App should now be running on emulator.
    echo.
    echo If you see errors:
    echo 1. Check Metro bundler window for errors
    echo 2. Press R in Metro window to reload
    echo 3. Press Ctrl+M on emulator to open dev menu
    echo.
) else (
    echo.
    echo ========================================
    echo BUILD/INSTALL FAILED
    echo ========================================
    echo Check the error messages above.
    echo.
    echo Common fixes:
    echo 1. Make sure emulator is running
    echo 2. Check Metro bundler is running on port 8081
    echo 3. Try: npx react-native start --reset-cache
    echo.
)

pause



