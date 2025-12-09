# PowerShell script to help optimize app assets
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "App Asset Optimization Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check asset sizes
Write-Host "Analyzing assets in src/assets..." -ForegroundColor Yellow
Write-Host ""

$assets = Get-ChildItem -Path "src\assets" -Recurse -File | Where-Object {!$_.PSIsContainer}

if ($assets.Count -eq 0) {
    Write-Host "No assets found in src/assets" -ForegroundColor Red
    exit
}

$totalSize = ($assets | Measure-Object -Property Length -Sum).Sum
$totalSizeMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "Total assets: $($assets.Count)" -ForegroundColor Green
Write-Host "Total size: $totalSizeMB MB" -ForegroundColor Green
Write-Host ""

# Show largest files
Write-Host "Top 10 Largest Files:" -ForegroundColor Yellow
Write-Host "----------------------------------------"
$assets | Sort-Object Length -Descending | Select-Object -First 10 | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
    if ($sizeMB -gt 1) {
        Write-Host "$relativePath : $sizeMB MB" -ForegroundColor Red
    } elseif ($sizeKB -gt 100) {
        Write-Host "$relativePath : $sizeKB KB" -ForegroundColor Yellow
    } else {
        Write-Host "$relativePath : $sizeKB KB" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Recommendations:" -ForegroundColor Cyan
Write-Host "========================================"

$largeFiles = $assets | Where-Object { $_.Length -gt 500KB }
if ($largeFiles.Count -gt 0) {
    Write-Host "⚠️  Found $($largeFiles.Count) files larger than 500KB:" -ForegroundColor Yellow
    $largeFiles | ForEach-Object {
        Write-Host "   - $($_.Name) ($([math]::Round($_.Length / 1MB, 2)) MB)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "💡 Consider:" -ForegroundColor Cyan
    Write-Host "   1. Compress these images using TinyPNG or similar"
    Write-Host "   2. Convert PNG to WebP format (saves 25-35%)"
    Write-Host "   3. Reduce image dimensions if possible"
    Write-Host ""
}

$pngFiles = $assets | Where-Object { $_.Extension -eq ".png" -and $_.Length -gt 100KB }
if ($pngFiles.Count -gt 0) {
    Write-Host "💡 Found $($pngFiles.Count) PNG files larger than 100KB" -ForegroundColor Cyan
    Write-Host "   Consider converting to WebP format to save space"
    Write-Host ""
}

Write-Host "✅ Optimizations already enabled:" -ForegroundColor Green
Write-Host "   - ProGuard minification"
Write-Host "   - Resource shrinking"
Write-Host "   - ABI filters (ARM only)"
Write-Host ""
Write-Host "Expected final APK size: 40-60 MB" -ForegroundColor Green
Write-Host ""

