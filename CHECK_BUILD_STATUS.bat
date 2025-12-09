@echo off
echo ========================================
echo Checking Build Status
echo ========================================
echo.

echo Checking if Metro bundler is running...
netstat -ano | findstr :8081 >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Metro bundler is running on port 8081
) else (
    echo [INFO] Metro bundler is not running
    echo Start it with: npx react-native start
)
echo.

echo Checking if emulator/device is connected...
adb devices
echo.

echo Checking Gradle daemon status...
cd android
call gradlew.bat --status
echo.

echo ========================================
echo Build Status Check Complete
echo ========================================
echo.
echo If build is still running, this is normal for first build.
echo First builds take 10-20 minutes.
echo.
pause



