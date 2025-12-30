# Fix: "CODE_SIGN_STYLE=Manual" Error in Codemagic

## The Problem

Codemagic is building with `CODE_SIGN_STYLE=Manual` even though:
- ✅ Your `ExportOptions.plist` specifies `signingStyle=automatic`
- ✅ Your Xcode project has `CODE_SIGN_STYLE = Automatic`
- ✅ You have App Store Connect API credentials configured

## Root Cause

The `xcode-project build-ipa` command in Codemagic is detecting that no provisioning profile is manually configured and defaulting to manual signing mode, which then fails because no profile is provided.

## Solution: Configure Automatic Signing in Codemagic UI

**The most reliable fix is to configure automatic code signing in Codemagic's UI settings**, not just in the YAML file.

### Step 1: Add App Store Connect API Key in Codemagic

**⚠️ RECOMMENDED: Use Environment Variables (Easiest Method)**

Since you're already on the Environment Variables page, use this method:

#### ✅ Method 1: Environment Variables (RECOMMENDED)

1. **Go to Environment Variables** (You're already here!)
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings
   - Click **Environment variables** tab
   - You should see input fields for adding variables

2. **Create Group First:**
   - Click **"Select group"** button (next to the variable input fields)
   - Click **"Create new group"** or **"New group"**
   - Name it: `app_store_credentials`
   - Click **Create** or **Save**

3. **Add Three Variables** (one at a time):

   **Variable 1:**
   - **Variable name**: `APP_STORE_ISSUER_ID`
   - **Variable value**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - **Select group**: `app_store_credentials`
   - Click **Add** or **Save**

   **Variable 2:**
   - **Variable name**: `APP_STORE_KEY_ID`
   - **Variable value**: `4GFW8YSP2G`
   - **Select group**: `app_store_credentials`
   - Click **Add** or **Save**

   **Variable 3:**
   - **Variable name**: `APP_STORE_PRIVATE_KEY`
   - **Variable value**: [Full content from `AuthKey_4GFW8YSP2G.p8` file]
     - Include everything from the file:
     - `-----BEGIN PRIVATE KEY-----`
     - [all the content in the middle]
     - `-----END PRIVATE KEY-----`
   - **Select group**: `app_store_credentials`
   - Click **Add** or **Save**

4. **Verify:**
   - You should now see 3 variables listed under `app_store_credentials` group

---

#### Method 2: Teams → Integrations (If Available)

**Only use this if you can find the Integrations section:**

1. **Go to Teams**
   - Click **Teams** in the top navigation
   - Select **Personal Account** (or your team name)
   - Click **Integrations** tab

2. **Add API Key**
   - Under **Apple Developer Portal**, click **"Manage keys"**
   - Click **"Create key"**
   - Fill in:
     - **Name**: `TTelGo App Store Connect API`
     - **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
     - **Key ID**: `4GFW8YSP2G`
     - **Private Key**: Upload the `.p8` file or paste its content
   - Click **Save**

**Note:** If you can't find this section, use Method 1 (Environment Variables) instead!

### Step 2: Configure iOS Code Signing in Codemagic UI

1. **Go to App Settings**
   - In Codemagic, go to your app: **TTleGoApp**
   - Click **Settings** → **iOS code signing**

2. **Enable Automatic Signing**
   - Select **"Automatic"** as the code signing method
   - Select your **App Store Connect API key** (the one you just added)
   - Select **Bundle ID**: `org.reactjs.native.example.MyApp`
   - Select **Profile type**: `App Store`
   - Click **Save**

### Step 3: Verify Bundle ID Exists

Your bundle ID must exist in Apple Developer account:

1. **Go to Apple Developer**
   - Visit: https://developer.apple.com/account/
   - Sign in with `support@ttelgo.com`

2. **Check/Create Bundle ID**
   - Certificates, Identifiers & Profiles → **Identifiers**
   - Search for: `org.reactjs.native.example.MyApp`
   - If it doesn't exist:
     - Click **"+"** → **App IDs**
     - Enter: `org.reactjs.native.example.MyApp`
     - Register it

3. **Register App in App Store Connect** (if needed)
   - Go to: https://appstoreconnect.apple.com/
   - **My Apps** → **Create new app**
   - Use bundle ID: `org.reactjs.native.example.MyApp`

### Step 4: Commit Updated codemagic.yaml

The `TTleGoApp/codemagic.yaml` file has been updated with:
- ✅ Proper API credential verification
- ✅ Automatic code signing setup
- ✅ Better error messages

```bash
cd TTleGoApp
git add codemagic.yaml
git commit -m "Fix: Configure automatic code signing with App Store Connect API"
git push origin main
```

### Step 5: Start New Build

1. **Go to Codemagic Dashboard**
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a
   - Click **"Start new build"**

2. **Select Branch**: `main`

3. **Start Build**

4. **Monitor Build Logs**
   - Look for: "=== Code Signing Configuration ==="
   - Should see Issuer ID, Key ID, and Bundle ID
   - Should NOT see `CODE_SIGN_STYLE=Manual`
   - Should see automatic signing being used

## Alternative: If UI Settings Don't Work

If you can't access the UI settings, try this workaround in the YAML:

```yaml
- name: Build ipa for distribution
  script: |
    # Force automatic signing by building archive manually
    xcodebuild -workspace "$XCODE_WORKSPACE" \
      -scheme "$XCODE_SCHEME" \
      -archivePath build/ios/xcarchive/MyApp.xcarchive \
      archive \
      CODE_SIGN_STYLE=Automatic \
      DEVELOPMENT_TEAM="" \
      CODE_SIGN_IDENTITY="Apple Distribution"
    
    # Export IPA with automatic signing
    xcodebuild -exportArchive \
      -archivePath build/ios/xcarchive/MyApp.xcarchive \
      -exportPath build/ios/ipa \
      -exportOptionsPlist ios/ExportOptions.plist
```

## Why This Happens

Codemagic's `xcode-project build-ipa` command:
1. Checks if provisioning profiles are manually configured
2. If not found, it tries to use manual signing
3. This fails because no manual profile is provided
4. The solution is to configure automatic signing in Codemagic UI, which tells the build system to use App Store Connect API

## Expected Build Output (When Fixed)

```
=== Code Signing Configuration ===
Issuer ID: b79b1792-7bf3-4b25-b677-2161ea034aa8
Key ID: 4GFW8YSP2G
Bundle ID: org.reactjs.native.example.MyApp
Setting up automatic code signing with App Store Connect API...
Creating provisioning profile...
Building IPA with automatic code signing...
✅ Build succeeded
```

## Checklist

Before starting build:

- [ ] App Store Connect API key added in Codemagic Settings
- [ ] iOS code signing configured in Codemagic UI (Automatic)
- [ ] Bundle ID exists in Apple Developer account
- [ ] App registered in App Store Connect (if needed)
- [ ] Updated `TTleGoApp/codemagic.yaml` committed and pushed
- [ ] Ready to start build

The key is configuring automatic signing in **Codemagic's UI settings**, not just the YAML file!

