@echo off
echo ========================================
echo Fixing Emulator Issues
echo ========================================
echo.

echo Step 1: Stopping all processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM qemu-system-x86_64.exe >nul 2>&1
taskkill /F /IM adb.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Done.
echo.

echo Step 2: Starting ADB server...
if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
    "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" kill-server
    "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" start-server
    echo ADB server restarted.
) else (
    echo ADB not found in default location. Trying to use system ADB...
    adb kill-server >nul 2>&1
    adb start-server >nul 2>&1
)
echo.

echo Step 3: Checking emulator status...
if exist "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" (
    "%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe" devices
) else (
    adb devices
)
echo.

echo Step 4: Instructions to fix emulator storage issue:
echo.
echo The emulator has a storage allocation error. Try these solutions:
echo.
echo OPTION 1: Wipe Emulator Data (Recommended)
echo 1. Open Android Studio
echo 2. Go to Tools ^> Device Manager
echo 3. Click the dropdown arrow next to your emulator
echo 4. Select "Wipe Data"
echo 5. Restart the emulator
echo.
echo OPTION 2: Cold Boot Emulator
echo 1. Open Android Studio
echo 2. Go to Tools ^> Device Manager
echo 3. Click the dropdown arrow next to your emulator
echo 4. Select "Cold Boot Now"
echo.
echo OPTION 3: Create New Emulator
echo 1. Open Android Studio
echo 2. Go to Tools ^> Device Manager
echo 3. Click "Create Device"
echo 4. Create a new emulator with more storage
echo.
echo OPTION 4: Use Physical Device
echo Connect your Android phone via USB and enable USB debugging
echo.
echo After fixing the emulator, run:
echo   npx react-native run-android
echo.
pause



