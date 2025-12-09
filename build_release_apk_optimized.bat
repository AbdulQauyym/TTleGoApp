@echo off
echo ========================================
echo Building Optimized Release APK (40-60 MB)
echo ========================================
echo.
echo This will take 5-10 minutes. Please DO NOT cancel!
echo.
echo Optimizations enabled:
echo - ProGuard minification: ENABLED
echo - Resource shrinking: ENABLED
echo - ABI filters: armeabi-v7a, arm64-v8a only
echo - Resource configs: English only, xxhdpi/xxxhdpi
echo - Hermes engine: ENABLED
echo.
pause

cd android

echo.
echo Starting Gradle build...
echo.

.\gradlew.bat clean assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Build completed successfully!
    echo ========================================
    echo.
    
    set "APK_PATH=app\build\outputs\apk\release\app-release.apk"
    if exist "%APK_PATH%" (
        for %%F in ("%APK_PATH%") do (
            set /a SIZE_MB=%%~zF/1024/1024
            echo APK Location: %cd%\%%~nxF
            echo APK Size: %%~zF bytes (~!SIZE_MB! MB)
            echo.
            echo APK is ready for distribution!
        )
    ) else (
        echo ERROR: APK not found at %APK_PATH%
    )
) else (
    echo.
    echo ========================================
    echo Build failed with error code: %ERRORLEVEL%
    echo ========================================
)

echo.
pause









