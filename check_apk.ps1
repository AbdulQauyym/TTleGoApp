# Check if release APK exists and show its size
$apkPath = "android\app\build\outputs\apk\release\app-release.apk"

if (Test-Path $apkPath) {
    $apk = Get-Item $apkPath
    $sizeMB = [math]::Round($apk.Length / 1MB, 2)
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "✅ Release APK Generated Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "File: $($apk.Name)" -ForegroundColor Cyan
    Write-Host "Size: $sizeMB MB" -ForegroundColor Cyan
    Write-Host "Location: $($apk.FullName)" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Green
    
    if ($sizeMB -ge 30 -and $sizeMB -le 40) {
        Write-Host "`n✅ Perfect! APK size is within target range (30-40 MB)" -ForegroundColor Green
    } elseif ($sizeMB -lt 30) {
        Write-Host "`n⚠️  APK is smaller than target (under 30 MB)" -ForegroundColor Yellow
    } else {
        Write-Host "`n⚠️  APK is larger than target (over 40 MB)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n⏳ APK not found yet. The build is still in progress..." -ForegroundColor Yellow
    Write-Host "Please wait for the build to complete (5-10 minutes)." -ForegroundColor Yellow
}









