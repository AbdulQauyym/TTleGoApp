# Fix NDK Installation Issue

## The Problem
The NDK directory exists but is **incomplete/corrupted** - missing `source.properties` file. This usually happens when:
- Installation was interrupted
- Installation failed partway through
- Corrupted download

## Solution: Reinstall NDK

### Option 1: Remove and Reinstall via Android Studio (RECOMMENDED)

1. **Open Android Studio**
2. **Tools → SDK Manager**
3. **SDK Tools tab**
4. **Uncheck "NDK (Side by side)"** → Click **Apply** (this removes it)
5. **Check "NDK (Side by side)"** again → Select version **27.1.12297006**
6. **Click Apply** → Wait for complete installation
7. Make sure it fully completes (don't interrupt)

### Option 2: Remove Directory and Reinstall

1. **Close Android Studio**
2. **Delete the incomplete NDK directory:**
   ```
   C:\Users\Zia\AppData\Local\Android\Sdk\ndk\27.1.12297006
   ```
3. **Reopen Android Studio**
4. **Tools → SDK Manager → SDK Tools**
5. **Check "NDK (Side by side)"** → Version 27.1.12297006
6. **Apply** → Wait for complete installation

### Option 3: Use Command Line (Advanced)

If you want to use command line to remove and reinstall:

```powershell
# Remove incomplete NDK
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Android\Sdk\ndk\27.1.12297006" -ErrorAction SilentlyContinue

# Reinstall via sdkmanager (if available)
& "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "ndk;27.1.12297006"
```

---

## Verify Installation

After reinstalling, verify the NDK is complete:
- Check that `source.properties` exists in: `C:\Users\Zia\AppData\Local\Android\Sdk\ndk\27.1.12297006\source.properties`
- The directory should have many files and folders (not empty)

---

## Then Try Building Again

Once NDK is properly installed:
```powershell
npm run android
```

---

## Alternative: Use a Different NDK Version

If version 27.1.12297006 keeps having issues, you can try installing a different NDK version and updating `build.gradle`:

1. Install a different NDK version (e.g., 26.x.x or 27.0.x) via SDK Manager
2. Update `android/build.gradle` line 7 to match the installed version:
   ```gradle
   ndkVersion = "26.1.10909125"  // or whatever version you install
   ```

But try reinstalling 27.1.12297006 first!

