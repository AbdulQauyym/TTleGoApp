# How to Set Up Code Signing in Codemagic

Since you can't find the code signing options in the UI, here are alternative ways to set it up:

## Method 1: Via Environment Variables (Recommended)

Since you already have the App Store Connect API key, Codemagic can use it automatically. You just need to make sure the environment variables are set:

### Steps:

1. **In Codemagic Dashboard**:
   - Go to your **TTleGoApp** project
   - Click **Settings** (gear icon)
   - Go to **Environment variables** tab
   - **OR** go to **Environment groups** → **app_store_credentials**

2. **Add/Verify these variables exist**:
   - `APP_STORE_ISSUER_ID` - Your Issuer ID from App Store Connect
   - `APP_STORE_KEY_ID` - Your Key ID from App Store Connect  
   - `APP_STORE_PRIVATE_KEY` - Your Private Key (.p8 file content)

3. **If they don't exist, add them manually**:
   - Click **Add variable**
   - Add each variable with its value
   - Make sure they're in the `app_store_credentials` group (or create that group)

## Method 2: During Build Setup

When you start a new build in Codemagic:

1. **Click "Start new build"**
2. **Before starting**, look for:
   - A **"Code signing"** section in the build configuration
   - **"iOS signing"** options
   - **"Signing certificates"** dropdown

3. **If you see signing options**:
   - Select **"Automatic"** or **"Use App Store Connect API"**
   - The build will use your API key automatically

## Method 3: Update Xcode Project Directly

If Codemagic UI doesn't have code signing options, we can configure it in the Xcode project file. However, this requires modifying the project.pbxproj file, which is complex.

## Method 4: Use Codemagic's Automatic Detection

Codemagic should automatically detect and use your App Store Connect API key if:
- ✅ The API key is added in **Account Settings** → **Codemagic API** → **App Store Connect API keys**
- ✅ The environment variables are set (or auto-populated)
- ✅ The bundle ID matches your App Store Connect app

## What to Check Right Now:

1. **Verify API Key is Added**:
   - Go to Codemagic → **Account Settings** (top right)
   - **Codemagic API** → **App Store Connect API keys**
   - Make sure your API key is listed there

2. **Check Environment Variables**:
   - In your app settings → **Environment variables**
   - Look for `APP_STORE_ISSUER_ID`, `APP_STORE_KEY_ID`, `APP_STORE_PRIVATE_KEY`
   - If missing, add them manually

3. **Try Starting a Build**:
   - Sometimes code signing options only appear when starting a build
   - Look for signing configuration during the build setup process

## Quick Test:

1. **Start a new build** in Codemagic
2. **Check the build logs** - they might show what's missing
3. **If it fails with "requires provisioning profile"**, it means:
   - Either the API key isn't properly configured
   - Or you need to set up code signing through a different method

## Alternative: Contact Codemagic Support

If you still can't find code signing options:
- Use Codemagic's support chat (usually in the bottom right)
- Ask them: "Where do I configure iOS code signing for my app?"
- They can guide you to the exact location in your account

## Current Configuration

Your `codemagic.yaml` is set up to use:
- App Store Connect API key (via `app_store_credentials` group)
- Automatic code signing (via `xcode-project use-profiles`)

The build should work if the API key credentials are properly set in Codemagic's environment variables.














