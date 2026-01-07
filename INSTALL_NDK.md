# Install Android NDK - Quick Fix

## The Problem
The build failed because Android NDK (Native Development Kit) version 27.1.12297006 failed to install automatically.

## Solution: Install via Android Studio (EASIEST)

### Step 1: Open Android Studio SDK Manager
1. Open **Android Studio**
2. Go to **Tools → SDK Manager** (or click the SDK Manager icon in the toolbar)
3. Wait for it to load

### Step 2: Install NDK
1. Click on the **"SDK Tools"** tab (at the top)
2. Check the box for **"NDK (Side by side)"** 
3. You'll see it shows version **27.1.12297006** or similar
4. If you see multiple NDK versions, check **27.1.12297006** specifically
5. Click **"Apply"** or **"OK"**
6. Accept the license agreement
7. Wait for it to download and install (may take a few minutes)

### Step 3: Try Building Again
Once NDK is installed, go back to your terminal and run:
```powershell
npm run android
```

---

## Alternative: Install via Command Line

If you prefer command line, you can use `sdkmanager`:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" "ndk;27.1.12297006"
```

But Android Studio SDK Manager is easier! 😊

---

## After Installing NDK

Once NDK is installed, the build should work. The first build will still take some time, but it should complete successfully.

