@echo off
echo ========================================
echo Generating TTelGo App - Release APK
echo ========================================
echo.
echo This will create your optimized app!
echo.
echo Please wait 5-10 minutes...
echo.
pause

cd android
call gradlew.bat clean
call gradlew.bat assembleRelease

cd ..

if exist "android\app\build\outputs\apk\release\app-release.apk" (
    for %%F in ("android\app\build\outputs\apk\release\app-release.apk") do (
        set /a SIZE_MB=%%~zF/1024/1024
        echo.
        echo ========================================
        echo ✅ APP GENERATED SUCCESSFULLY!
        echo ========================================
        echo.
        echo APK Location: %%~fF
        echo APK Size: %%~zF bytes (~!SIZE_MB! MB)
        echo.
        if !SIZE_MB! GTR 60 (
            echo ⚠️  Size is over 60 MB - consider optimizing assets
        ) else if !SIZE_MB! LSS 40 (
            echo ✅ Size is below 40 MB - very optimized!
        ) else (
            echo ✅ Size is within target range (40-60 MB)!
        )
        echo.
        echo Your app is ready!
        echo.
        start explorer "android\app\build\outputs\apk\release"
    )
) else (
    echo.
    echo ❌ Build failed or APK not found
    echo Check the errors above
)

pause










