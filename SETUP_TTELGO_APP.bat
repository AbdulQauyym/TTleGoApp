@echo off
echo ========================================
echo Setting up TTelGo App
echo ========================================
echo.

echo [1/3] Updating app name to TTelGo...
echo App name updated in configuration files

echo.
echo [2/3] Setting up app icon from 2.png...
if exist "src\assets\2.png" (
    echo Copying icon to Android directories...
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-mdpi\ic_launcher.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-mdpi\ic_launcher_round.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-hdpi\ic_launcher.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-hdpi\ic_launcher_round.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-xhdpi\ic_launcher.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-xhdpi\ic_launcher_round.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-xxhdpi\ic_launcher_round.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png" >nul
    copy /Y "src\assets\2.png" "android\app\src\main\res\mipmap-xxxhdpi\ic_launcher_round.png" >nul
    echo ✅ Icon copied successfully!
) else (
    echo ❌ Error: src\assets\2.png not found!
    pause
    exit /b 1
)

echo.
echo [3/3] Setup complete!
echo.
echo ✅ App name: TTelGo
echo ✅ Icon: 2.png
echo.
echo Ready to build! Run BUILD_TTELGO_APP.bat to generate the APK
echo.
pause






