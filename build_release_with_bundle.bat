@echo off
echo ========================================
echo Building Release APK with JS Bundle
echo ========================================
echo.

cd android

echo Step 1: Cleaning previous build...
call gradlew.bat clean

echo.
echo Step 2: Building release APK with bundle...
echo This will take 5-10 minutes. Please wait...
echo.

call gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo APK Location:
    echo app\build\outputs\apk\release\app-release.apk
    echo.
    cd ..
    powershell -ExecutionPolicy Bypass -File check_apk.ps1
) else (
    echo.
    echo ❌ BUILD FAILED!
    echo Please check the error messages above.
    cd ..
)

pause







