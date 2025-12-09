# App Size Optimization Guide

## Target Size: 40-60 MB

This guide helps you optimize your React Native app to stay within 40-60 MB.

## Current Optimizations Already Applied

✅ **ProGuard minification** - Enabled in release builds
✅ **Resource shrinking** - Enabled in release builds  
✅ **ABI filters** - Only armeabi-v7a and arm64-v8a (removes x86)
✅ **Hermes** - Enabled for smaller JavaScript bundle

## Step 1: Optimize Image Assets

### Check Current Asset Sizes
```bash
# Windows PowerShell
Get-ChildItem -Path "src\assets" -Recurse -File | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB, 2)}}
```

### Optimize Images
1. **Use WebP format** (saves 25-35% size)
   - Convert PNG/JPG to WebP
   - React Native supports WebP natively

2. **Compress existing images:**
   - Use tools like: TinyPNG, ImageOptim, or Squoosh
   - Target: 70-80% quality for JPG, optimize PNG

3. **Remove unused assets:**
   - Check `src/assets/` for unused images
   - Remove duplicate images

## Step 2: Remove Unused Dependencies

### Check Bundle Size
```bash
npm install -g react-native-bundle-visualizer
npx react-native-bundle-visualizer
```

### Remove if not needed:
- Unused libraries in `package.json`
- Unused native modules
- Development-only dependencies

## Step 3: Enable Additional Optimizations

### Update android/app/build.gradle
Already configured with:
- `shrinkResources true` - Removes unused resources
- `minifyEnabled true` - Minifies Java/Kotlin code
- ABI filters - Only ARM architectures

### Additional Gradle Optimizations (Already Applied)
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
    }
}
```

## Step 4: Optimize JavaScript Bundle

### Enable Hermes (Should be enabled)
Check `android/gradle.properties`:
```
hermesEnabled=true
```

### Bundle Size Reduction Tips
1. Use dynamic imports for heavy screens
2. Remove unused exports
3. Enable tree-shaking
4. Use `react-native-bundle-visualizer` to find large dependencies

## Step 5: Asset Optimization Script

Run this to analyze your assets:
```bash
# Check largest assets
powershell -Command "Get-ChildItem -Path 'src\assets' -Recurse | Where-Object {!$_.PSIsContainer} | Sort-Object Length -Descending | Select-Object -First 10 Name, @{Name='Size(MB)';Expression={[math]::Round($_.Length/1MB, 2)}}"
```

## Step 6: Build Optimized Release APK

Use the provided script:
```bash
build_release_apk_optimized.bat
```

This will:
- Clean previous builds
- Build optimized release APK
- Show final APK size

## Expected APK Size Breakdown

| Component | Typical Size |
|-----------|--------------|
| Native code (ARM only) | 15-20 MB |
| JavaScript bundle | 1-3 MB |
| Assets (images) | 2-5 MB |
| React Native framework | 15-20 MB |
| Other resources | 2-5 MB |
| **Total** | **35-55 MB** |

## Quick Wins for Size Reduction

1. **Convert large images to WebP** - Can save 2-5 MB
2. **Remove unused assets** - Check for duplicates
3. **Enable ProGuard** - Already enabled ✓
4. **Use ABI filters** - Already enabled ✓
5. **Optimize fonts** - Only include needed font weights
6. **Code splitting** - Use lazy loading for screens

## Monitoring App Size

After building, check APK size:
```bash
# Windows
dir android\app\build\outputs\apk\release\app-release.apk
```

Target: **40-60 MB** ✅

If over 60 MB:
1. Check for large image files
2. Review dependencies
3. Enable more aggressive ProGuard rules
4. Consider removing unused features

## Maintenance

- Regularly audit assets folder
- Monitor bundle size after adding dependencies
- Use `npx react-native-bundle-visualizer` quarterly
- Remove unused code and assets










