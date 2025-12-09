@echo off
echo Building Release APK...
echo This will take 3-5 minutes. Please wait...
echo.

cd android
call gradlew.bat assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo Release APK location:
    echo app\build\outputs\apk\release\app-release.apk
    echo.
    cd ..
    echo Checking APK size...
    powershell -Command "$f = Get-Item 'android\app\build\outputs\apk\release\app-release.apk'; Write-Host 'APK Size:' ([math]::Round($f.Length/1MB,2)) 'MB'"
) else (
    echo.
    echo Build failed. Please check the error messages above.
)

pause


