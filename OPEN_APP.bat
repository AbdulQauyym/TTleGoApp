@echo off
echo ========================================
echo Opening MyApp on Emulator
echo ========================================
echo.

echo Waiting for Metro bundler to be ready...
timeout /t 5 /nobreak >nul

echo.
echo Launching app...
adb shell am start -n com.myapp/.MainActivity

echo.
echo ========================================
echo App should now open on emulator
echo ========================================
echo.
echo If you see errors on the emulator:
echo 1. Shake the emulator (Ctrl+M or Cmd+M)
echo 2. Select "Reload" from the dev menu
echo 3. Or press 'R' twice in the Metro bundler terminal
echo.
pause








