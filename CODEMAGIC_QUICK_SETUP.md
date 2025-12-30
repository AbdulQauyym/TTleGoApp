# Quick Setup: Codemagic with Your API Credentials

## Your Configuration Details

- **Codemagic App**: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings
- **Account**: support@ttelgo.com
- **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- **Key ID**: `4GFW8YSP2G`
- **Private Key File**: `AuthKey_4GFW8YSP2G.p8`

## Step 1: Add API Key in Codemagic

1. **Go to Settings**
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings
   - Sign in with: `support@ttelgo.com`

2. **Navigate to App Store Connect API Keys**
   - Click: **Settings** → **Codemagic API** → **App Store Connect API keys**
   - Or: **Settings** → **Integrations** → **App Store Connect API**

3. **Click "Add API key" or "New API key"**

4. **Fill in the Form:**
   ```
   Name: TTelGo App Store Connect API
   
   Issuer ID: b79b1792-7bf3-4b25-b677-2161ea034aa8
   
   Key ID: 4GFW8YSP2G
   
   Private Key: [Copy entire content from AuthKey_4GFW8YSP2G.p8 file]
   ```

5. **For Private Key:**
   - Open `AuthKey_4GFW8YSP2G.p8` file
   - Copy **everything** including:
     ```
     -----BEGIN PRIVATE KEY-----
     [all the key content]
     -----END PRIVATE KEY-----
     ```
   - Paste into the Private Key field

6. **Click "Save" or "Add"**

## Step 2: Verify Environment Group

After saving, Codemagic will create an environment group. Check:

1. Go to: **Settings** → **Environment variables**
2. Look for a group (usually named `app_store_credentials` or similar)
3. **Note the exact group name** - it must match line 29 in `codemagic.yaml`

## Step 3: Verify codemagic.yaml

Your `codemagic.yaml` is already configured with:
- ✅ Environment group: `app_store_credentials` (line 29)
- ✅ Email: `support@ttelgo.com` (line 74)
- ✅ All build scripts ready

**If the group name differs**, update line 29 to match exactly.

## Step 4: Start Build

1. **Go to Dashboard**
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a
   - Click **"Start new build →"**

2. **Select Branch**
   - Choose: `main` (or your preferred branch)

3. **Start Build**
   - Click **"Start new build"**
   - Build will take ~10-20 minutes

4. **Download IPA**
   - After build completes, go to **Artifacts** tab
   - Download the `.ipa` file

## Configuration Summary

✅ **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`  
✅ **Key ID**: `4GFW8YSP2G`  
✅ **Account**: `support@ttelgo.com`  
✅ **Email Notifications**: `support@ttelgo.com`  
✅ **Environment Group**: `app_store_credentials` (verify in Codemagic)

## Important: Private Key File

You need the `.p8` file for key `4GFW8YSP2G`:
- File name: `AuthKey_4GFW8YSP2G.p8`
- If you don't have it:
  1. Go to: https://appstoreconnect.apple.com/
  2. Sign in with `support@ttelgo.com`
  3. Users and Access → Keys
  4. Find key ID `4GFW8YSP2G`
  5. Download the `.p8` file (⚠️ You can only download once!)

## Troubleshooting

### "Environment group not found"
- Check exact group name in Codemagic Settings
- Update `codemagic.yaml` line 29 to match exactly

### "Invalid API key"
- Verify Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- Verify Key ID: `4GFW8YSP2G`
- Ensure private key includes BEGIN/END markers

## Quick Checklist

- [ ] Go to Codemagic Settings
- [ ] Add API key with Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- [ ] Add Key ID: `4GFW8YSP2G`
- [ ] Add Private Key from `AuthKey_4GFW8YSP2G.p8`
- [ ] Note environment group name
- [ ] Verify `codemagic.yaml` line 29 matches group name
- [ ] Start build
- [ ] Download IPA

Your configuration is ready! Just add the API key in Codemagic Settings and start building.

