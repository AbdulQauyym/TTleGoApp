@echo off
echo ========================================
echo Running App Without Auto-Install
echo ========================================
echo.

echo This script will:
echo 1. Start Metro bundler
echo 2. Build the APK
echo 3. You can manually install it later
echo.

echo Step 1: Starting Metro bundler...
start "Metro Bundler" cmd /k "npx react-native start --reset-cache"
timeout /t 5 /nobreak
echo Metro bundler started.
echo.

echo Step 2: Building APK (without installing)...
cd android
call gradlew.bat assembleDebug
cd ..

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo APK Location:
    echo android\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo To install manually:
    echo 1. Make sure emulator is running
    echo 2. Drag and drop the APK onto the emulator
    echo    OR use: adb install android\app\build\outputs\apk\debug\app-debug.apk
    echo.
) else (
    echo.
    echo BUILD FAILED - Check errors above
)

pause



