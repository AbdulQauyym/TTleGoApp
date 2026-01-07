# Fix ADB Not Recognized Error

## The Issue
You're seeing: `'"adb"' is not recognized as an internal or external command`

This happens because ADB (Android Debug Bridge) is not in your system PATH.

## Quick Fix (Temporary - Current Session Only)

The build is still working because React Native uses the full path. But to fix the warning:

**Option 1: Add to PATH for Current PowerShell Session**
```powershell
$env:Path += ";$env:LOCALAPPDATA\Android\Sdk\platform-tools"
```

## Permanent Fix (Recommended)

Add ADB to your system PATH permanently:

### Windows 10/11:
1. Press `Win + X` → **System** → **Advanced system settings**
2. Click **Environment Variables**
3. Under **System variables**, find and select **Path**, then click **Edit**
4. Click **New** and add:
   ```
   %LOCALAPPDATA%\Android\Sdk\platform-tools
   ```
5. Click **OK** on all windows
6. **Restart your terminal/PowerShell**

### Or via PowerShell (Run as Administrator):
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:LOCALAPPDATA\Android\Sdk\platform-tools", [EnvironmentVariableTarget]::Machine)
```

## Current Status

✅ **Your build is still working!** The warnings are just informational.
✅ **Emulator is running** (emulator-5554)
✅ **Gradle is building** (this takes a few minutes the first time)

The app will install and run even with these warnings. The PATH fix is just to clean up the error messages.

