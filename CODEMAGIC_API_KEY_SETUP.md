# Codemagic App Store Connect API Key Configuration

## Your API Credentials

- **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- **Key ID**: `4GFW8YSP2G`
- **Account**: `support@ttelgo.com`
- **Codemagic App**: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings

## Step-by-Step Configuration

### Step 1: Navigate to Codemagic Settings

1. **Go to Codemagic Dashboard**
   - Visit: https://codemagic.io/
   - Sign in with `support@ttelgo.com`
   - Select your **TTleGoApp** project

2. **Open Settings**
   - Click **Settings** (gear icon) in the top right
   - Or go directly to: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings

### Step 2: Add App Store Connect API Key

1. **Navigate to API Keys Section**
   - In Settings, find **"Codemagic API"** section
   - Click on **"App Store Connect API keys"**
   - Or look for **"Integrations"** → **"App Store Connect API"**

2. **Add New API Key**
   - Click **"Add API key"** or **"New API key"** button
   - Fill in the form with these exact values:

   **API Key Configuration:**
   ```
   Name: TTelGo App Store Connect API
   Issuer ID: b79b1792-7bf3-4b25-b677-2161ea034aa8
   Key ID: 4GFW8YSP2G
   Private Key: [See Step 3 below]
   ```

3. **Add Private Key**
   - You need the `.p8` file for key ID `4GFW8YSP2G`
   - The file should be named: `AuthKey_4GFW8YSP2G.p8`
   - Open the file and copy the **entire content**, including:
     ```
     -----BEGIN PRIVATE KEY-----
     [key content here]
     -----END PRIVATE KEY-----
     ```
   - Paste it into the **Private Key** field

4. **Save the API Key**
   - Click **"Save"** or **"Add"**
   - Codemagic will create an environment group automatically
   - **Note the group name** (usually `app_store_credentials` or similar)

### Step 3: Verify Environment Group

After saving, Codemagic creates an environment group. Check:

1. **Go to Environment Variables**
   - Settings → **Environment variables**
   - Look for a group (e.g., `app_store_credentials`)

2. **Verify Variables Created**
   - `APP_STORE_ISSUER_ID` = `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - `APP_STORE_KEY_ID` = `4GFW8YSP2G`
   - `APP_STORE_PRIVATE_KEY` = [Your private key content]

### Step 4: Verify codemagic.yaml

Your `codemagic.yaml` should reference the environment group:

```yaml
environment:
  groups:
    - app_store_credentials  # Must match the group name from Codemagic
```

**Important**: Make sure the group name in `codemagic.yaml` (line 29) matches exactly what Codemagic created.

### Step 5: Test Configuration

1. **Start a Test Build**
   - Go to your app dashboard
   - Click **"Start new build"**
   - Select branch: `main`
   - Start build

2. **Check Build Logs**
   - Monitor the build progress
   - If you see errors about credentials, verify:
     - API key is correctly added
     - Environment group name matches
     - All fields are correctly filled

## Configuration Summary

✅ **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`  
✅ **Key ID**: `4GFW8YSP2G`  
✅ **Account**: `support@ttelgo.com`  
✅ **Environment Group**: `app_store_credentials` (verify in Codemagic)  
✅ **codemagic.yaml**: Already configured (line 29)

## Important Notes

1. **Private Key File**
   - You need `AuthKey_4GFW8YSP2G.p8` file
   - If you don't have it, download it from App Store Connect:
     - Go to: https://appstoreconnect.apple.com/
     - Users and Access → Keys
     - Find key ID `4GFW8YSP2G`
     - Download the `.p8` file (you can only download it once!)

2. **Environment Group Name**
   - Codemagic automatically creates a group name
   - It might be `app_store_credentials` or something similar
   - Check in Settings → Environment variables
   - Update `codemagic.yaml` line 29 if it doesn't match

3. **Key Permissions**
   - Ensure the API key has proper permissions in App Store Connect
   - It needs access to create certificates and provisioning profiles

## Troubleshooting

### "Environment group not found"
- Check the exact group name in Codemagic Settings
- Update `codemagic.yaml` line 29 to match exactly
- Group names are case-sensitive

### "Invalid API key"
- Verify Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- Verify Key ID: `4GFW8YSP2G`
- Ensure private key includes BEGIN/END markers
- Check for extra spaces or line breaks

### "Code signing failed"
- Verify API key has proper permissions
- Check bundle ID exists in Apple Developer account
- Ensure automatic code signing is enabled

## Next Steps

1. ✅ Add API key in Codemagic Settings
2. ✅ Verify environment group name
3. ✅ Update `codemagic.yaml` if group name differs
4. ✅ Start test build
5. ✅ Download IPA when build completes

## Quick Reference

- **Codemagic Settings**: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- **Key ID**: `4GFW8YSP2G`

