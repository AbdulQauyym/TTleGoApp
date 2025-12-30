# Codemagic Code Signing Setup Guide

## Where to Find Code Signing in Codemagic

Code signing in Codemagic can be configured in several places. Here's where to look:

### Option 1: In Workflow Settings (Recommended)

1. **Go to your Codemagic app**: https://codemagic.io/apps
2. **Click on "TTleGoApp"**
3. **Click on "Settings"** (gear icon in the top right)
4. Look for these sections:
   - **"iOS code signing"** - This is where you configure signing
   - **"Certificates"** - For uploading certificates
   - **"Provisioning profiles"** - For uploading profiles

### Option 2: During Build Configuration

1. **Start a new build** (or edit existing workflow)
2. **In the build configuration**, look for:
   - **"Code signing"** section
   - **"iOS signing"** options
   - **"Automatic signing"** toggle

### Option 3: Via Environment Variables

If code signing options aren't visible, you can set it up via environment variables:

1. **Go to Settings** → **Environment variables**
2. **Add these variables** (if using App Store Connect API):
   - `APP_STORE_CONNECT_ISSUER_ID`
   - `APP_STORE_KEY_ID`
   - `APP_STORE_PRIVATE_KEY`

### Option 4: In codemagic.yaml (Direct Configuration)

The code signing can also be configured directly in the YAML file. I've updated your `codemagic.yaml` to include iOS signing configuration.

## Alternative: Use Automatic Signing via App Store Connect API

Since you already have the App Store Connect API key set up, Codemagic can use that for automatic signing:

1. **Make sure your API key is added**:
   - Go to **Account Settings** (top right) → **Codemagic API** → **App Store Connect API keys**
   - Verify your API key is there

2. **The build should automatically use it** if:
   - The API key is configured
   - The bundle ID matches your App Store Connect app
   - Your Apple Developer account has the necessary permissions

## Quick Fix: Update codemagic.yaml for Automatic Signing

I've updated your `codemagic.yaml` file. Now try this:

1. **Commit and push the updated codemagic.yaml**:
   ```bash
   git add codemagic.yaml
   git commit -m "Update code signing configuration"
   git push origin main
   ```

2. **In Codemagic, when starting a build**:
   - Look for **"iOS code signing"** or **"Signing"** options in the build configuration
   - Select **"Automatic"** or **"Use App Store Connect API"**

## If Code Signing Options Still Don't Appear

1. **Check your Codemagic plan**:
   - Some features may require a paid plan
   - Free tier has limited code signing options

2. **Try the Codemagic CLI approach**:
   - The `xcode-project use-profiles` command should work if profiles are uploaded
   - Upload certificates/profiles manually if needed

3. **Contact Codemagic Support**:
   - They can help you locate the code signing settings
   - Or provide alternative configuration methods

## Manual Certificate Upload (If Available)

If you see a "Certificates" or "Files" section in Settings:

1. **Upload your Distribution Certificate** (.p12 file)
2. **Upload your Provisioning Profile** (.mobileprovision file)
3. **Set the bundle identifier** to match

## Next Steps

1. **Check all Settings tabs** in your Codemagic app
2. **Look for "iOS" or "Signing" related sections**
3. **Try starting a new build** - signing options might appear during build setup
4. **Check Codemagic documentation**: https://docs.codemagic.io/code-signing/ios-code-signing/

The updated `codemagic.yaml` should help, but you may need to configure signing through the Codemagic web interface during your first build setup.







