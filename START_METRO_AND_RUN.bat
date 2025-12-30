@echo off
echo ========================================
echo Starting Metro Bundler and Running App
echo ========================================
echo.

echo Step 1: Setting up ADB reverse for USB devices...
where adb >nul 2>&1
if %errorlevel% equ 0 (
    adb reverse tcp:8081 tcp:8081
    if %errorlevel% equ 0 (
        echo [OK] ADB reverse configured successfully
    ) else (
        echo [WARNING] ADB reverse failed. If using USB device, make sure it's connected.
    )
) else (
    echo [INFO] ADB not found in PATH. Skipping ADB reverse.
    echo If using USB device, you may need to configure ADB manually.
    echo Check: FIX_METRO_ERROR.md for instructions.
)
echo.

echo Step 2: Starting Metro Bundler in background...
start "Metro Bundler" cmd /k "npm start"

echo Waiting 8 seconds for Metro to start...
timeout /t 8 /nobreak >nul

echo Step 3: Running Android app...
echo.
npx react-native run-android

echo.
echo ========================================
echo IMPORTANT:
echo 1. Keep the Metro Bundler window open
echo 2. If the app still shows the error:
echo    - Shake your device and tap "Reload"
echo    - Or press R twice in the Metro bundler terminal
echo 3. For USB devices, make sure ADB reverse is set up
echo ========================================
echo.

pause

