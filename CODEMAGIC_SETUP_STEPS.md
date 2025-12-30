# Step-by-Step: Generate IPA with Codemagic

## Quick Setup Guide

### Step 1: Add App Store Connect API Key to Codemagic

1. **Go to Codemagic Dashboard**
   - Visit: https://codemagic.io/
   - Sign in and select **TTleGoApp** project

2. **Add API Key**
   - Click **Settings** (gear icon) → **Codemagic API** → **App Store Connect API keys**
   - Click **"Add API key"** or **"New API key"**
   - Fill in:
     - **Name**: `TTelGo API Key`
     - **Issuer ID**: [Your Issuer ID - UUID format]
     - **Key ID**: `7N33Y5K6LG`
     - **Private Key**: Copy entire content from `AuthKey_7N33Y5K6LG.p8`:
       ```
       -----BEGIN PRIVATE KEY-----
       MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgCFV5Dmr5qnKGHKUl
       846mDAuQrR8JQ75SGrj0D1D6ssigCgYIKoZIzj0DAQehRANCAATmuGcffFDQgW5E
       sfsmDukIEtfuD5xN7P87DGMVoVyzIknUd1dAeJX9RERhKZoDjGqzfvvqIm7xN3C0
       wQeyg6Rh
       -----END PRIVATE KEY-----
       ```
   - Click **Save**

3. **Note the Environment Group Name**
   - Codemagic will create a group (e.g., `app_store_credentials`)
   - This should match line 29 in your `codemagic.yaml`

### Step 2: Verify codemagic.yaml Configuration

Your `codemagic.yaml` is already set up! Just verify:

✅ **Environment Group** (line 29): `- app_store_credentials`
✅ **Workspace**: `ios/MyApp.xcworkspace`
✅ **Scheme**: `MyApp`
✅ **ExportOptions**: `ios/ExportOptions.plist` exists

**Optional Updates:**
- Line 74: Update email to receive build notifications
- Lines 33-34: Update bundle ID if needed

### Step 3: Start Build

1. **In Codemagic Dashboard**
   - Click **"Start new build →"** (top right)
   - Select branch: `main` (or your preferred branch)
   - Click **"Start new build"**

2. **Build Process**
   - Codemagic will:
     - Install Node.js dependencies
     - Install CocoaPods
     - Build iOS app
     - Generate IPA file
   - Build time: ~10-20 minutes

### Step 4: Download IPA

1. **After Build Completes**
   - Go to build details page
   - Click **Artifacts** tab
   - Find `.ipa` file
   - Click **Download**

## Your Configuration

- **Key ID**: `7N33Y5K6LG`
- **Issuer ID**: [Add in Codemagic Settings]
- **Private Key**: `AuthKey_7N33Y5K6LG.p8`
- **Bundle ID**: `org.reactjs.native.example.MyApp`
- **Workspace**: `ios/MyApp.xcworkspace`
- **Scheme**: `MyApp`

## Troubleshooting

### "Environment group not found"
- Make sure the group name in Codemagic matches `app_store_credentials` in `codemagic.yaml`

### "Code signing failed"
- Verify API key is correctly added in Codemagic Settings
- Check that Issuer ID, Key ID, and Private Key are correct

### "Bundle ID not found"
- Create the bundle ID in App Store Connect
- Or update bundle ID in `codemagic.yaml` to match existing one

## Next Steps After IPA is Generated

1. **Test IPA**: Install on test device using TestFlight or Ad Hoc distribution
2. **Submit to App Store**: Use the IPA to submit via App Store Connect
3. **Automate**: Uncomment TestFlight publishing in `codemagic.yaml` (lines 79-88)

