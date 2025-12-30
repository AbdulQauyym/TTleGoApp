# Generate IPA File Using Codemagic

This guide will help you set up Codemagic to build and generate an IPA file for your React Native app.

## Prerequisites

✅ You have:
- **Issuer ID** (from App Store Connect)
- **Key ID**: `7N33Y5K6LG`
- **Private Key**: `AuthKey_7N33Y5K6LG.p8`

## Step 1: Add App Store Connect API Key to Codemagic

1. **Go to Codemagic Dashboard**
   - Navigate to https://codemagic.io/
   - Sign in to your account
   - Select your **TTleGoApp** project

2. **Navigate to Settings**
   - Click on **Settings** (gear icon) in the top right
   - Or go to: Settings → Codemagic API → App Store Connect API keys

3. **Add API Key**
   - Click **"Add API key"** or **"New API key"**
   - Fill in the following:
     - **Name**: `TTleGoApp API Key` (or any name you prefer)
     - **Issuer ID**: Paste your Issuer ID (UUID format)
     - **Key ID**: `7N33Y5K6LG`
     - **Private Key**: Open your `AuthKey_7N33Y5K6LG.p8` file and copy the entire contents including:
       ```
       -----BEGIN PRIVATE KEY-----
       [key content]
       -----END PRIVATE KEY-----
       ```
   - Click **Save**

4. **Create Environment Group**
   - After saving, Codemagic will create an environment group (usually named after your API key)
   - Note the group name (e.g., `app_store_credentials`)

## Step 2: Update codemagic.yaml

Your `codemagic.yaml` is already configured! Just make sure:

1. **Environment Group Name Matches**
   - In your `codemagic.yaml`, line 29: `- app_store_credentials`
   - Make sure this matches the group name created in Codemagic Settings

2. **Update Email Recipient** (Optional)
   - Line 74: Change `your-email@example.com` to your actual email
   - This is where build notifications will be sent

3. **Verify Bundle ID**
   - Current: `org.reactjs.native.example.MyApp`
   - If you want to change it, update lines 33-34 in `codemagic.yaml`
   - Also update it in Xcode project settings

## Step 3: Create ExportOptions.plist (If Missing)

If `ios/ExportOptions.plist` doesn't exist, create it:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
```

**Note**: Replace `YOUR_TEAM_ID` with your Apple Developer Team ID (found in Apple Developer account).

## Step 4: Start Your First Build

1. **Go to Codemagic Dashboard**
   - Select your **TTleGoApp** project
   - Click **"Start new build →"** button (top right)

2. **Select Branch**
   - Choose the branch you want to build (e.g., `main`)

3. **Start Build**
   - Click **"Start new build"**
   - Codemagic will:
     - Install dependencies
     - Install CocoaPods
     - Build the iOS app
     - Generate the IPA file
     - Upload artifacts

## Step 5: Download IPA File

After the build completes:

1. **Go to Build Details**
   - Click on the completed build
   - Navigate to **Artifacts** section

2. **Download IPA**
   - Find the `.ipa` file in the artifacts list
   - Click **Download** to get your IPA file

## Step 6: (Optional) Publish to TestFlight

If you want to automatically publish to TestFlight, uncomment lines 79-88 in `codemagic.yaml`:

```yaml
app_store_connect:
  auth:
    issuer_id: $APP_STORE_ISSUER_ID
    key_id: $APP_STORE_KEY_ID
    key: $APP_STORE_PRIVATE_KEY
  submit_to_testflight: true
  beta_groups:
    - group name 1
    - group name 2
```

## Troubleshooting

### Issue: "Code signing failed"
- **Solution**: Make sure the App Store Connect API key is properly added in Codemagic Settings
- Verify the environment group name matches in `codemagic.yaml`

### Issue: "Bundle ID not found"
- **Solution**: 
  - Update the bundle ID in `codemagic.yaml` (lines 33-34)
  - Make sure the bundle ID exists in your Apple Developer account
  - Or create it in App Store Connect

### Issue: "ExportOptions.plist not found"
- **Solution**: Create the file as shown in Step 3 above

### Issue: "Build timeout"
- **Solution**: Increase `max_build_duration` in `codemagic.yaml` (currently 120 minutes)

## Build Configuration Summary

Your current setup:
- **Workflow**: `ios-workflow`
- **Instance**: `mac_mini_m1`
- **Xcode**: Latest
- **Node**: 20
- **Workspace**: `ios/MyApp.xcworkspace`
- **Scheme**: `MyApp`
- **Bundle ID**: `org.reactjs.native.example.MyApp`

## Next Steps

1. ✅ Add API key to Codemagic Settings
2. ✅ Verify environment group name
3. ✅ Update email in `codemagic.yaml`
4. ✅ Start your first build
5. ✅ Download IPA file

## Resources

- [Codemagic Documentation](https://docs.codemagic.io/)
- [App Store Connect API](https://developer.apple.com/app-store-connect/api/)
- [Codemagic YAML Reference](https://docs.codemagic.io/yaml/yaml-getting-started/)

