@echo off
echo ========================================
echo Debugging React Native App
echo ========================================
echo.

echo Step 1: Checking Metro Bundler...
netstat -ano | findstr :8081
if errorlevel 1 (
    echo Metro bundler is NOT running!
    echo Starting Metro bundler...
    start "Metro Bundler" cmd /k "npx react-native start --reset-cache"
    echo Waiting 10 seconds for Metro to start...
    timeout /t 10 /nobreak >nul
) else (
    echo Metro bundler is running on port 8081
)

echo.
echo Step 2: Uninstalling app...
cd android
call gradlew.bat uninstallAll
cd ..

echo.
echo Step 3: Rebuilding and installing app...
call npx react-native run-android --no-packager

echo.
echo Step 4: Launching app manually...
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    "%ANDROID_HOME%\platform-tools\adb.exe" shell am start -n com.myapp/.MainActivity
    echo.
    echo Step 5: Checking for crash logs...
    timeout /t 3 /nobreak >nul
    "%ANDROID_HOME%\platform-tools\adb.exe" logcat -d | findstr /i "ReactNative\|Error\|Exception\|FATAL" | findstr /v "chromium"
) else (
    echo ADB not found. Please check Android SDK installation.
)

echo.
echo ========================================
echo Debug complete!
echo ========================================
echo.
echo Check:
echo 1. Metro bundler window for JavaScript errors
echo 2. Emulator screen for red error screen
echo 3. Press Ctrl+M on emulator to open dev menu
echo.
pause








