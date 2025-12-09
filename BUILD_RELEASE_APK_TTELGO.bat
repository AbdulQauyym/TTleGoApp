@echo off
echo ========================================
echo Building TTelGo Release APK
echo ========================================
echo.

echo Step 1: Setting up app icon...
node setup_icon.js
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Icon setup had issues, continuing anyway...
)
echo.

echo Step 2: Cleaning previous builds...
cd android
call gradlew.bat clean
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Clean had some issues, continuing anyway...
)
echo.

echo Step 3: Building Release APK...
echo This may take 10-15 minutes, please wait...
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
    echo App Name: TTelGo
    echo Icon: src/assets/2.png
    echo.
    echo The APK is ready to install!
    echo.
    cd ..
    if exist "android\app\build\outputs\apk\release\app-release.apk" (
        for %%A in ("android\app\build\outputs\apk\release\app-release.apk") do (
            echo APK Size: %%~zA bytes
            set /a sizeMB=%%~zA/1048576
            echo APK Size: !sizeMB! MB
        )
    )
) else (
    echo.
    echo ========================================
    echo BUILD FAILED
    echo ========================================
    echo Please check the error messages above.
)

cd ..
pause



