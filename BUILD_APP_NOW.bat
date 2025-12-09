@echo off
echo ========================================
echo Building TTelGo App - Release APK
echo ========================================
echo.
echo This will generate the app with:
echo - TTelGo app icon (if you've replaced icons)
echo - Optimized size: 40-60 MB target
echo - All optimizations enabled
echo.
echo This will take 5-10 minutes. Please DO NOT cancel!
echo.
pause

cd android

echo.
echo Cleaning previous builds...
.\gradlew.bat clean

echo.
echo ========================================
echo Building Release APK...
echo ========================================
echo.
.\gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Build completed successfully!
    echo ========================================
    echo.
    
    cd ..
    set "APK_PATH=android\app\build\outputs\apk\release\app-release.apk"
    if exist "%APK_PATH%" (
        for %%F in ("%APK_PATH%") do (
            set /a SIZE_MB=%%~zF/1024/1024
            echo.
            echo ========================================
            echo APK Generated Successfully!
            echo ========================================
            echo.
            echo APK Location: %cd%\%%~nxF
            echo Full Path: %%~fF
            echo APK Size: %%~zF bytes (~!SIZE_MB! MB)
            echo.
            if !SIZE_MB! LSS 40 (
                echo ⚠️  APK is smaller than expected
            ) else if !SIZE_MB! GTR 60 (
                echo ⚠️  APK is larger than 60 MB - consider optimizing assets
            ) else (
                echo ✅ APK size is within target range (40-60 MB)!
            )
            echo.
            echo Your app is ready for distribution!
            echo.
        )
    ) else (
        echo ERROR: APK not found at %APK_PATH%
        echo Check build logs above for errors
    )
) else (
    echo.
    echo ========================================
    echo Build failed with error code: %ERRORLEVEL%
    echo ========================================
    echo.
    echo Please check the error messages above
)

echo.
pause










