@echo off
echo Building TTelGo Release APK (Quick Build)...
echo.

cd android
call gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo APK Location:
    echo android\app\build\outputs\apk\release\app-release.apk
    echo.
) else (
    echo.
    echo BUILD FAILED - Check errors above
)

pause




