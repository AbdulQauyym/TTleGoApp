# Script to start Android Emulator
Write-Host "Starting Android Emulator..." -ForegroundColor Cyan

# Common Android SDK locations
$sdkPaths = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "$env:ANDROID_HOME",
    "C:\Android\Sdk",
    "$env:USERPROFILE\AppData\Local\Android\Sdk"
)

$emulatorPath = $null
foreach ($path in $sdkPaths) {
    if ($path -and (Test-Path "$path\emulator\emulator.exe")) {
        $emulatorPath = "$path\emulator\emulator.exe"
        Write-Host "Found Android SDK at: $path" -ForegroundColor Green
        break
    }
}

if (-not $emulatorPath) {
    Write-Host "`n❌ Android SDK not found!" -ForegroundColor Red
    Write-Host "Please make sure Android Studio is installed and ANDROID_HOME is set." -ForegroundColor Yellow
    Write-Host "`nAlternatively, you can start the emulator from Android Studio:" -ForegroundColor Yellow
    Write-Host "1. Open Android Studio" -ForegroundColor White
    Write-Host "2. Click on 'Device Manager' (or Tools > Device Manager)" -ForegroundColor White
    Write-Host "3. Click the Play button next to an emulator" -ForegroundColor White
    exit 1
}

# List available AVDs
Write-Host "`nAvailable Emulators:" -ForegroundColor Cyan
$avds = & $emulatorPath -list-avds
if ($avds.Count -eq 0) {
    Write-Host "No emulators found. Please create one in Android Studio." -ForegroundColor Red
    exit 1
}

$avds | ForEach-Object { Write-Host "  - $_" -ForegroundColor White }

# Start the first available emulator
$firstAvd = $avds[0]
Write-Host "`nStarting emulator: $firstAvd" -ForegroundColor Cyan
Write-Host "This may take a minute or two..." -ForegroundColor Yellow

# Start emulator in background
Start-Process -FilePath $emulatorPath -ArgumentList "-avd", $firstAvd -WindowStyle Normal

Write-Host "`n✅ Emulator is starting..." -ForegroundColor Green
Write-Host "Wait for the emulator to fully boot (you'll see the Android home screen)." -ForegroundColor Yellow
Write-Host "Then you can run: npx react-native run-android" -ForegroundColor Cyan







