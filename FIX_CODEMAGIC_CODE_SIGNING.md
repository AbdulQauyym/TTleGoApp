# Fix Code Signing Error in Codemagic

## The Error

```
"MyApp" requires a provisioning profile. Select a provisioning profile in the Signing & Capabilities editor.
```

This happens when Codemagic tries to use manual code signing instead of automatic signing with App Store Connect API.

## Solution: Updated codemagic.yaml

I've updated your `codemagic.yaml` to properly use automatic code signing with App Store Connect API.

### Key Changes:

1. **Removed manual code signing configuration**
2. **Added proper automatic code signing setup**
3. **Using Codemagic's `xcode-project use-profiles` with App Store Connect API**

## What You Need to Verify

### 1. App Store Connect API Key in Codemagic

Make sure you've added the API key in Codemagic Settings:
- **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- **Key ID**: `4GFW8YSP2G`
- **Private Key**: Content from `AuthKey_4GFW8YSP2G.p8`
- **Environment Group**: `app_store_credentials` (or whatever name Codemagic created)

### 2. Environment Group Name

Check the exact group name in Codemagic:
1. Go to: Settings → Environment variables
2. Find the group created when you added the API key
3. Make sure line 29 in `codemagic.yaml` matches exactly

### 3. Bundle ID Configuration

Your bundle ID is: `org.reactjs.native.example.MyApp`

**Important**: This bundle ID must:
- Exist in your Apple Developer account
- Be registered in App Store Connect
- Match the bundle ID in your Xcode project

If it doesn't exist:
1. Go to: https://appstoreconnect.apple.com/
2. Sign in with `support@ttelgo.com`
3. My Apps → Create new app (if needed)
4. Register the bundle ID: `org.reactjs.native.example.MyApp`

## Updated codemagic.yaml Configuration

The updated configuration:
- ✅ Uses automatic code signing
- ✅ Leverages App Store Connect API
- ✅ Properly configures profiles with `xcode-project use-profiles`
- ✅ Builds IPA with automatic signing

## Testing the Fix

1. **Commit and Push**
   ```bash
   git add codemagic.yaml
   git commit -m "Fix code signing: Use automatic signing with App Store Connect API"
   git push origin main
   ```

2. **Start Build in Codemagic**
   - Go to Codemagic dashboard
   - Click "Start new build"
   - Select branch: `main`
   - Start build

3. **Monitor Build**
   - Watch for code signing setup step
   - Should see: "Setting up automatic code signing with App Store Connect API"
   - Should NOT see manual provisioning profile errors

## Alternative: If Bundle ID Doesn't Exist

If you need to use a different bundle ID:

1. **Update codemagic.yaml** (lines 33-34):
   ```yaml
   APP_ID: "com.ttelgo.app"  # Your actual bundle ID
   BUNDLE_ID: "com.ttelgo.app"  # Your actual bundle ID
   ```

2. **Update Xcode Project**:
   - Open `ios/MyApp.xcworkspace` in Xcode
   - Select project → Target → General
   - Update Bundle Identifier to match

3. **Register in App Store Connect**:
   - Create the bundle ID in Apple Developer account
   - Register app in App Store Connect

## Troubleshooting

### Still getting "requires a provisioning profile"
- Verify API key is correctly added in Codemagic Settings
- Check environment group name matches exactly
- Ensure bundle ID exists in Apple Developer account
- Verify App Store Connect API key has proper permissions

### "Bundle ID not found"
- Create bundle ID in Apple Developer account
- Register app in App Store Connect
- Or update bundle ID to an existing one

### "Invalid API key"
- Verify Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- Verify Key ID: `4GFW8YSP2G`
- Check private key includes BEGIN/END markers
- Ensure API key has proper permissions in App Store Connect

## Next Steps

1. ✅ Verify API key in Codemagic Settings
2. ✅ Check environment group name
3. ✅ Ensure bundle ID exists in Apple Developer
4. ✅ Commit updated codemagic.yaml
5. ✅ Start new build
6. ✅ Monitor for code signing success

The updated configuration should resolve the provisioning profile error!

