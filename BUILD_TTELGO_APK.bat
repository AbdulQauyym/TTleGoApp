@echo off
echo ========================================
echo Building TTelGo Release APK
echo ========================================
echo.

echo Step 1: Setting up app icon...
node setup_icon.js
echo.

echo Step 2: Cleaning previous builds...
cd android
call gradlew.bat clean
echo.

echo Step 3: Building Release APK...
echo This may take several minutes, please wait...
call gradlew.bat assembleRelease
echo.

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo APK Location:
    echo android\app\build\outputs\apk\release\app-release.apk
    echo.
    echo The APK is ready to install!
) else (
    echo.
    echo ========================================
    echo BUILD FAILED
    echo ========================================
    echo Please check the error messages above.
)

pause




