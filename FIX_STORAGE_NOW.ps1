# Quick fix for storage error
$adb = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"

if (-not (Test-Path $adb)) {
    Write-Host "ADB not found! Please install Android SDK." -ForegroundColor Red
    exit
}

Write-Host "=== FIXING EMULATOR STORAGE ===" -ForegroundColor Cyan
Write-Host ""

# Check devices
$devices = & $adb devices
if ($devices -notmatch "device$") {
    Write-Host "No emulator connected! Please start your emulator first." -ForegroundColor Red
    exit
}

Write-Host "✓ Emulator connected" -ForegroundColor Green
Write-Host ""

# Check current storage
Write-Host "Current storage:" -ForegroundColor Yellow
& $adb shell df -h /data
Write-Host ""

# Uninstall old app
Write-Host "Uninstalling old app..." -ForegroundColor Yellow
$packages = @("com.ttelgo.myapp", "com.myapp", "com.myapp.myapp")
foreach ($pkg in $packages) {
    $result = & $adb uninstall $pkg 2>&1
    if ($result -match "Success") {
        Write-Host "✓ Uninstalled: $pkg" -ForegroundColor Green
    }
}
Write-Host ""

# Clear caches aggressively
Write-Host "Clearing system caches (this may take a moment)..." -ForegroundColor Yellow
& $adb shell pm trim-caches 3000M
Write-Host "✓ Cache cleared" -ForegroundColor Green
Write-Host ""

# Check storage again
Write-Host "Storage after cleanup:" -ForegroundColor Yellow
& $adb shell df -h /data
Write-Host ""

Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "Try installing again: npx react-native run-android" -ForegroundColor Cyan
Write-Host ""
Write-Host "If still failing, you MUST increase emulator storage:" -ForegroundColor Yellow
Write-Host "1. Android Studio → Tools → Device Manager" -ForegroundColor White
Write-Host "2. Edit emulator (pencil icon)" -ForegroundColor White
Write-Host "3. Show Advanced Settings" -ForegroundColor White
Write-Host "4. Change Internal Storage to 8GB" -ForegroundColor White
Write-Host "5. RESTART emulator" -ForegroundColor White

