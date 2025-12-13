# Codemagic iOS Build Setup Guide

This guide will help you set up Codemagic CI/CD to build iOS IPA files for your React Native app.

## Prerequisites

1. **Apple Developer Account**: You need an active Apple Developer Program membership ($99/year)
2. **GitHub Repository**: Your code should be pushed to https://github.com/AbdulQauyym/TTleGoApp
3. **Codemagic Account**: Sign up at https://codemagic.io/

## Step 1: Sign Up for Codemagic

1. Go to https://codemagic.io/
2. Click "Sign up" and connect your GitHub account
3. Authorize Codemagic to access your repositories

## Step 2: Add Your App to Codemagic

1. After signing in, click "Add application"
2. Select **GitHub** as your Git provider
3. Find and select your repository: **AbdulQauyum/TTleGoApp**
4. Click "Add application"

## Step 3: Configure iOS Code Signing

### Option A: Automatic Code Signing (Recommended for beginners)

1. In Codemagic, go to your app settings
2. Navigate to **Code signing** section
3. Click **Add credentials**
4. Select **Automatic code signing**
5. Enter your Apple ID credentials
6. Codemagic will automatically manage certificates and provisioning profiles

### Option B: Manual Code Signing (For production)

1. You'll need:
   - Distribution Certificate (.p12 file)
   - Provisioning Profile (.mobileprovision file)
   - App Store Connect API Key (for automatic distribution)

2. In Codemagic:
   - Go to **Settings** > **Codemagic API** > **App Store Connect API keys**
   - Create a new API key
   - Download the key file (.p8)
   - Note the Key ID and Issuer ID

3. Add these as environment variables in Codemagic:
   - `APP_STORE_ISSUER_ID`
   - `APP_STORE_KEY_ID`
   - `APP_STORE_PRIVATE_KEY` (the .p8 file content)

## Step 4: Configure Build Settings

The `codemagic.yaml` file has been created in your repository. You need to:

1. **Update Bundle Identifier**:
   - Open `codemagic.yaml`
   - Find `APP_ID` and `BUNDLE_ID`
   - Update `com.ttelgo` to your actual bundle identifier (check in Xcode)

2. **Update Email**:
   - Find the `email` section in `publishing`
   - Replace `your-email@example.com` with your actual email

3. **Update ExportOptions.plist** (if using manual signing):
   - Open `ios/ExportOptions.plist`
   - Replace `YOUR_TEAM_ID` with your Apple Developer Team ID
   - Replace `YOUR_PROVISIONING_PROFILE_NAME` with your profile name

## Step 5: Push Configuration to GitHub

```bash
git add codemagic.yaml ios/ExportOptions.plist CODEMAGIC_SETUP.md
git commit -m "Add Codemagic CI/CD configuration for iOS builds"
git push origin main
```

## Step 6: Start Your First Build

1. Go to your app in Codemagic dashboard
2. Click **Start new build**
3. Select the workflow: **iOS Workflow**
4. Select branch: **main** (or your default branch)
5. Click **Start new build**

## Step 7: Download Your IPA

Once the build completes:

1. Go to the build details page
2. Scroll to **Artifacts** section
3. Download the `.ipa` file

## Troubleshooting

### Common Issues:

1. **Code Signing Errors**:
   - Ensure your Apple Developer account is active
   - Check that your bundle identifier matches in Xcode and Codemagic
   - Verify certificates are valid

2. **Build Failures**:
   - Check build logs in Codemagic
   - Ensure all dependencies are in `package.json`
   - Verify CocoaPods are properly configured

3. **Missing Dependencies**:
   - Make sure `node_modules` are not committed (they're in `.gitignore`)
   - Codemagic will run `npm install` automatically

## Additional Resources

- [Codemagic React Native Documentation](https://docs.codemagic.io/getting-started/react-native/)
- [iOS Code Signing Guide](https://docs.codemagic.io/code-signing/ios-code-signing/)
- [Codemagic YAML Reference](https://docs.codemagic.io/yaml/yaml-getting-started/)

## Next Steps

After your first successful build:

1. **Set up automatic builds**: Configure builds to trigger on every push to main
2. **TestFlight Distribution**: Uncomment the `app_store_connect` section in `codemagic.yaml` to automatically upload to TestFlight
3. **Add more workflows**: Create separate workflows for different build types (development, staging, production)

## Support

If you encounter issues:
- Check Codemagic documentation: https://docs.codemagic.io/
- Contact Codemagic support through their dashboard
- Review build logs for specific error messages






