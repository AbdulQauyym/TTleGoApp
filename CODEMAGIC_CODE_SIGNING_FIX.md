# Fix: "MyApp requires a provisioning profile" Error

## The Problem

Codemagic is trying to use manual code signing, but we need automatic code signing with App Store Connect API.

## Root Cause

The build command is defaulting to manual code signing instead of using the App Store Connect API credentials you've configured.

## Solution: Updated codemagic.yaml

I've updated your `codemagic.yaml` with:
1. ✅ Proper automatic code signing setup
2. ✅ Verification of API credentials
3. ✅ Correct use of `xcode-project use-profiles` command
4. ✅ Automatic profile creation with App Store Connect API

## Critical Steps to Fix

### Step 1: Verify API Key in Codemagic Settings

1. **Go to Codemagic Settings**
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings
   - Sign in with: `support@ttelgo.com`

2. **Check App Store Connect API Key**
   - Settings → Codemagic API → App Store Connect API keys
   - Verify the key exists with:
     - Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
     - Key ID: `4GFW8YSP2G`
     - Private Key: Complete content from `.p8` file

3. **Check Environment Group**
   - Settings → Environment variables
   - Find the group (usually `app_store_credentials`)
   - **Note the exact name** - it must match line 29 in `codemagic.yaml`

### Step 2: Verify Bundle ID Exists

Your bundle ID: `org.reactjs.native.example.MyApp`

**This bundle ID MUST exist in Apple Developer account:**

1. **Go to Apple Developer**
   - Visit: https://developer.apple.com/account/
   - Sign in with `support@ttelgo.com`

2. **Check/Create Bundle ID**
   - Certificates, Identifiers & Profiles → Identifiers
   - Search for: `org.reactjs.native.example.MyApp`
   - If it doesn't exist:
     - Click "+" to create new
     - Select "App IDs"
     - Enter: `org.reactjs.native.example.MyApp`
     - Register it

3. **Register App in App Store Connect** (if needed)
   - Go to: https://appstoreconnect.apple.com/
   - My Apps → Create new app
   - Use bundle ID: `org.reactjs.native.example.MyApp`

### Step 3: Commit and Push Updated codemagic.yaml

```bash
git add codemagic.yaml
git commit -m "Fix: Configure automatic code signing with App Store Connect API"
git push origin main
```

### Step 4: Start New Build

1. **Go to Codemagic Dashboard**
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a
   - Click **"Start new build"**

2. **Select Branch**: `main`

3. **Start Build**

4. **Monitor Build Logs**
   - Look for: "=== Code Signing Configuration ==="
   - Should see Issuer ID, Key ID, and Bundle ID
   - Should NOT see "requires a provisioning profile" error

## What the Updated Configuration Does

1. **Verifies API Credentials**
   - Checks that `APP_STORE_ISSUER_ID`, `APP_STORE_KEY_ID`, and `APP_STORE_PRIVATE_KEY` are available
   - Fails early with clear error if missing

2. **Sets Up Automatic Code Signing**
   - Uses `xcode-project use-profiles` with App Store Connect API
   - Automatically creates certificates and provisioning profiles
   - Configures for App Store distribution

3. **Builds IPA**
   - Uses automatic code signing throughout
   - No manual provisioning profiles needed

## Troubleshooting

### Error: "App Store Connect API credentials not found"
**Solution:**
- Verify API key is added in Codemagic Settings
- Check environment group name matches `codemagic.yaml` line 29
- Ensure group is properly linked to the workflow

### Error: "Bundle ID not found"
**Solution:**
- Create bundle ID in Apple Developer account
- Register app in App Store Connect
- Or update bundle ID in `codemagic.yaml` to an existing one

### Error: "Still requires provisioning profile"
**Solution:**
- Verify API key has proper permissions in App Store Connect
- Check that bundle ID exists and is registered
- Ensure environment group name is correct
- Try removing and re-adding the API key in Codemagic

### Error: "Invalid API key"
**Solution:**
- Verify Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- Verify Key ID: `4GFW8YSP2G`
- Ensure private key includes BEGIN/END markers
- Check for extra spaces or line breaks

## Configuration Checklist

Before starting build:

- [ ] API key added in Codemagic Settings
  - [ ] Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
  - [ ] Key ID: `4GFW8YSP2G`
  - [ ] Private Key: Complete content from `.p8` file
- [ ] Environment group name verified
- [ ] `codemagic.yaml` line 29 matches group name
- [ ] Bundle ID exists in Apple Developer account
- [ ] App registered in App Store Connect (if needed)
- [ ] Updated `codemagic.yaml` committed and pushed
- [ ] Ready to start build

## Expected Build Output

When working correctly, you should see:

```
=== Code Signing Configuration ===
Issuer ID: b79b1792-7bf3-4b25-b677-2161ea034aa8
Key ID: 4GFW8YSP2G
Bundle ID: org.reactjs.native.example.MyApp
...
Setting up automatic code signing...
Creating provisioning profile...
Building IPA...
✅ Build succeeded
```

## Next Steps

1. ✅ Verify all checklist items above
2. ✅ Commit updated `codemagic.yaml`
3. ✅ Start new build in Codemagic
4. ✅ Monitor build logs
5. ✅ Download IPA when build succeeds

The updated configuration should resolve the provisioning profile error!

