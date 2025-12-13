# Quick Fix Script for Android Build Error
# Run this script in PowerShell

Write-Host "=== Fixing Android Build Error ===" -ForegroundColor Green

# Step 1: Navigate to project
Set-Location "C:\Users\abdul\Downloads\ReatNative\MyApp"

# Step 2: Clean Android build folders
Write-Host "`nCleaning Android build folders..." -ForegroundColor Yellow
if (Test-Path "android\build") {
    Remove-Item -Recurse -Force "android\build" -ErrorAction SilentlyContinue
    Write-Host "✓ Removed android\build" -ForegroundColor Green
}
if (Test-Path "android\app\build") {
    Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue
    Write-Host "✓ Removed android\app\build" -ForegroundColor Green
}

# Step 3: Clean Gradle
Write-Host "`nCleaning Gradle..." -ForegroundColor Yellow
Set-Location "android"
if (Test-Path "gradlew.bat") {
    .\gradlew clean
    Write-Host "✓ Gradle clean completed" -ForegroundColor Green
} else {
    Write-Host "⚠ gradlew.bat not found" -ForegroundColor Red
}
Set-Location ..

# Step 4: Check if Metro is running
Write-Host "`nChecking Metro Bundler..." -ForegroundColor Yellow
$metroProcess = Get-Process | Where-Object {$_.ProcessName -eq "node"} | Where-Object {
    $_.CommandLine -like "*metro*" -or $_.CommandLine -like "*react-native*"
}
if ($metroProcess) {
    Write-Host "⚠ Metro bundler is running. Please stop it (Ctrl+C) before building." -ForegroundColor Yellow
} else {
    Write-Host "✓ Metro bundler is not running" -ForegroundColor Green
}

# Step 5: Instructions
Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Make sure an Android emulator is running OR a device is connected" -ForegroundColor White
Write-Host "2. Start Metro bundler in one terminal:" -ForegroundColor White
Write-Host "   npx react-native start --reset-cache" -ForegroundColor Gray
Write-Host "3. In another terminal, run:" -ForegroundColor White
Write-Host "   npx react-native run-android" -ForegroundColor Gray
Write-Host "`n=== Done ===" -ForegroundColor Green







