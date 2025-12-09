@echo off
echo ========================================
echo Building Fixed Release APK
echo ========================================
echo.
echo This will build a release APK with:
echo - JavaScript bundle included
echo - Proper ProGuard rules
echo - All assets bundled
echo.
echo This may take 5-10 minutes. Please wait...
echo.

cd android

echo Step 1: Cleaning previous build...
call gradlew.bat clean

echo.
echo Step 2: Building release APK...
call gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ BUILD SUCCESSFUL!
    echo ========================================
    echo.
    cd ..
    if exist "android\app\build\outputs\apk\release\app-release.apk" (
        for %%A in ("android\app\build\outputs\apk\release\app-release.apk") do (
            set size=%%~zA
            set /a sizeMB=!size!/1048576
            echo APK Location: android\app\build\outputs\apk\release\app-release.apk
            echo APK Size: !sizeMB! MB
        )
    )
    echo.
    echo ✅ APK is ready to install!
    echo.
    echo IMPORTANT: Make sure to:
    echo 1. Uninstall the old app from your device first
    echo 2. Install the new APK
    echo 3. The app should work without Metro bundler
    echo.
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo Please check the error messages above.
    cd ..
)

pause







