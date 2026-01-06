# Fix Code Signing Error in Codemagic

## The Error
```
"MyApp" requires a provisioning profile. Select a provisioning profile in the Signing & Capabilities editor.
```

## Solution: Set Up Code Signing in Codemagic

You need to configure code signing in Codemagic's web interface. Here's how:

### Option 1: Automatic Code Signing (Recommended)

1. **Go to Codemagic Dashboard**
   - Navigate to https://codemagic.io/
   - Select your **TTleGoApp** project

2. **Add Code Signing Credentials**
   - Click on **Settings** (gear icon)
   - Go to **Code signing** section
   - Click **Add credentials**

3. **Choose Automatic Code Signing**
   - Select **Automatic code signing**
   - Enter your **Apple ID** (the email associated with your Apple Developer account)
   - Enter your **App-specific password** (not your regular Apple ID password)
     - To create one: https://appleid.apple.com → Sign-In and Security → App-Specific Passwords
   - Click **Save**

4. **Configure Bundle Identifier**
   - Make sure the bundle ID matches: `org.reactjs.native.example.MyApp`
   - Or update it to your desired bundle ID (e.g., `com.ttelgo.app`)

### Option 2: Manual Code Signing (Advanced)

If you prefer manual code signing:

1. **Get Your Certificates and Profiles**
   - Download Distribution Certificate (.p12) from Apple Developer
   - Download Provisioning Profile (.mobileprovision) for App Store distribution

2. **Add to Codemagic**
   - In Codemagic Settings → Code signing
   - Upload your certificate and provisioning profile
   - Set the bundle identifier

3. **Update ExportOptions.plist**
   - Update `ios/ExportOptions.plist` with your Team ID and profile name

## Update Bundle Identifier (If Needed)

If you want to use a custom bundle ID (e.g., `com.ttelgo.app`):

1. **In Xcode** (if you have access):
   - Open `ios/MyApp.xcworkspace`
   - Select MyApp target
   - Go to Signing & Capabilities
   - Change Bundle Identifier to your desired ID
   - Enable "Automatically manage signing"

2. **Or Update in Codemagic**:
   - The bundle ID can be set in the code signing configuration
   - Make sure it matches your Apple Developer account

## After Setting Up Code Signing

1. **Commit and Push**:
   ```bash
   git add codemagic.yaml
   git commit -m "Fix code signing configuration"
   git push origin main
   ```

2. **Trigger New Build**:
   - The build should now succeed with proper code signing

## Verify Setup

After adding code signing credentials:
- Codemagic will automatically use them during the build
- The `xcode-project use-profiles` command will apply the profiles
- The build should complete successfully

## Troubleshooting

### Still Getting "Requires Provisioning Profile" Error?
- Double-check that code signing is configured in Codemagic Settings
- Verify the bundle ID matches in both Xcode and Codemagic
- Ensure your Apple Developer account is active
- Check that the App Store Connect API key is set up (if using)

### "Invalid Team ID" Error?
- Make sure your Apple Developer account has an active membership
- Verify the Team ID in Codemagic matches your Apple Developer Team ID

### Build Succeeds But IPA is Invalid?
- Check that you're using the correct export method (app-store)
- Verify the provisioning profile is for App Store distribution (not Ad Hoc or Development)














