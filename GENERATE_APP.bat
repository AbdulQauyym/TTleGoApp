@echo off
cls
echo ========================================
echo       GENERATING TTelGo APP
echo ========================================
echo.
echo Building optimized release APK...
echo This will take 5-10 minutes.
echo.
echo Optimizations:
echo - App size target: 40-60 MB
echo - ProGuard enabled
echo - Resource shrinking enabled
echo - ARM architectures only
echo.
pause

echo.
echo Starting build process...
echo.

cd android
call gradlew.bat clean
call gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    cd ..
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    
    if exist "android\app\build\outputs\apk\release\app-release.apk" (
        for %%F in ("android\app\build\outputs\apk\release\app-release.apk") do (
            set /a SIZE_MB=%%~zF/1024/1024
            echo APK Location: %%~fF
            echo APK Size: ~!SIZE_MB! MB
            echo.
            echo Your app is ready!
            echo.
            start explorer "android\app\build\outputs\apk\release"
        )
    )
) else (
    echo.
    echo BUILD FAILED!
    echo Check errors above.
)

pause










