# Complete Codemagic Configuration Guide

## Your Codemagic App Settings
**App URL**: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings

## Step 1: Configure App Store Connect API Key

### Navigate to API Keys Section

1. **Go to Settings**
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings
   - Or: Click **Settings** → **Codemagic API** → **App Store Connect API keys**

2. **Add New API Key**
   - Click **"Add API key"** or **"New API key"** button
   - Fill in the form:

   **API Key Details:**
   - **Name**: `TTelGo App Store Connect API`
   - **Issuer ID**: `[Your Issuer ID - UUID format]`
   - **Key ID**: `7N33Y5K6LG`
   - **Private Key**: Copy the entire content from `AuthKey_7N33Y5K6LG.p8`:
     ```
     -----BEGIN PRIVATE KEY-----
     MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgCFV5Dmr5qnKGHKUl
     846mDAuQrR8JQ75SGrj0D1D6ssigCgYIKoZIzj0DAQehRANCAATmuGcffFDQgW5E
     sfsmDukIEtfuD5xN7P87DGMVoVyzIknUd1dAeJX9RERhKZoDjGqzfvvqIm7xN3C0
     wQeyg6Rh
     -----END PRIVATE KEY-----
     ```

3. **Save the API Key**
   - Click **"Save"** or **"Add"**
   - Codemagic will automatically create an environment group
   - **Note the group name** (usually `app_store_credentials` or similar)

## Step 2: Verify Environment Variables

After adding the API key, Codemagic automatically creates these environment variables:

- `APP_STORE_ISSUER_ID` - Your Issuer ID
- `APP_STORE_KEY_ID` - `7N33Y5K6LG`
- `APP_STORE_PRIVATE_KEY` - Your private key content

These are available in your `codemagic.yaml` via the environment group.

## Step 3: Configure Code Signing (Optional)

If you need manual code signing:

1. **Go to Code Signing Section**
   - Settings → **Code signing identities**
   - Or: Settings → **Certificates and profiles**

2. **Add Certificate** (if not using App Store Connect API)
   - Upload your `.p12` certificate
   - Add provisioning profiles
   - Set bundle identifier

**Note**: With App Store Connect API, automatic code signing is preferred.

## Step 4: Configure Environment Variables (If Needed)

1. **Go to Environment Variables**
   - Settings → **Environment variables**
   - Or: Settings → **Variables**

2. **Add Custom Variables** (if needed):
   - `BUNDLE_ID`: `org.reactjs.native.example.MyApp`
   - `APP_VERSION`: `1.0.0`
   - Any other custom variables

## Step 5: Verify codemagic.yaml Configuration

Your `codemagic.yaml` should reference the environment group:

```yaml
environment:
  groups:
    - app_store_credentials  # Must match the group name from Step 1
```

## Step 6: Test Configuration

1. **Start a Test Build**
   - Go to your app dashboard
   - Click **"Start new build"**
   - Select branch: `main`
   - Start build

2. **Check Build Logs**
   - If you see errors about missing credentials, verify:
     - API key is correctly added
     - Environment group name matches
     - All fields are correctly filled

## Common Configuration Issues

### Issue: "Environment group not found"
**Solution:**
- Check the group name in Codemagic Settings
- Update `codemagic.yaml` line 29 to match exactly
- Group names are case-sensitive

### Issue: "Invalid API key"
**Solution:**
- Verify Issuer ID is correct (UUID format)
- Verify Key ID is `7N33Y5K6LG`
- Ensure private key includes BEGIN/END markers
- Check for extra spaces or line breaks

### Issue: "Code signing failed"
**Solution:**
- Ensure App Store Connect API key has proper permissions
- Verify bundle ID exists in Apple Developer account
- Check that automatic code signing is enabled in Xcode project

## Configuration Checklist

- [ ] App Store Connect API key added in Codemagic Settings
- [ ] Issuer ID entered correctly
- [ ] Key ID: `7N33Y5K6LG` entered
- [ ] Private key copied completely (with BEGIN/END markers)
- [ ] Environment group name noted
- [ ] `codemagic.yaml` references correct group name
- [ ] Email notification updated (optional)
- [ ] Test build started to verify configuration

## Next Steps After Configuration

1. **Start Your First Build**
   - Go to: https://codemagic.io/app/693d9147a47ff251a6fb6e7a
   - Click **"Start new build"**
   - Select branch and start

2. **Monitor Build**
   - Watch build progress
   - Check logs for any errors
   - Download IPA when complete

3. **Download IPA**
   - Go to build details
   - Click **Artifacts** tab
   - Download `.ipa` file

## Additional Settings to Configure

### Email Notifications
- Settings → **Notifications**
- Add email addresses to receive build notifications

### Webhooks (Optional)
- Settings → **Webhooks**
- Configure webhooks for build status updates

### Caching (Optional)
- Settings → **Caching**
- Enable caching to speed up builds

## Support Resources

- [Codemagic Documentation](https://docs.codemagic.io/)
- [App Store Connect API Guide](https://developer.apple.com/app-store-connect/api/)
- [Codemagic YAML Reference](https://docs.codemagic.io/yaml/yaml-getting-started/)

