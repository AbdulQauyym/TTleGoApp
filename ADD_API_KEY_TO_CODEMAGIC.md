# How to Add App Store Connect API Key to Codemagic

## Where to Find It

The location depends on your Codemagic account type. Here are all the possible locations:

## Method 1: Teams → Integrations (Most Common)

### For Personal Account:
1. **Click "Teams"** in the top navigation bar
2. **Select "Personal Account"**
3. **Click "Integrations"** tab
4. **Find "Apple Developer Portal"** section
5. **Click "Manage keys"**
6. **Click "Create key"**
7. Fill in:
   - **Name**: `TTelGo App Store Connect API`
   - **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - **Key ID**: `4GFW8YSP2G`
   - **Private Key**: Upload `.p8` file or paste content
8. **Click "Save"**

### For Team Account:
1. **Click "Team settings"** (or your team name)
2. **Click "Team integrations"**
3. **Find "Apple Developer Portal"** section
4. **Click "Manage keys"**
5. Follow steps 6-8 above

## Method 2: Account Settings

1. **Click your profile icon** (top right)
2. **Click "Account settings"**
3. Look for **"Integrations"** or **"API keys"** section
4. Find **"Apple Developer Portal"** or **"App Store Connect"**
5. Click **"Manage keys"** or **"Add key"**

## Method 3: Environment Variables (Alternative)

If you can't find the integrations section, add the API key as environment variables:

### Step 1: Create Environment Group

1. **Go to your app settings**
   - Visit: https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings
   - Click **"Environment variables"** tab

2. **Create a new group**
   - Click **"Select group"** button
   - Click **"Create new group"** or **"New group"**
   - Name it: `app_store_credentials`
   - Click **Save** or **Create**

### Step 2: Add Three Variables

Add these variables one by one:

**Variable 1: APP_STORE_ISSUER_ID**
- **Variable name**: `APP_STORE_ISSUER_ID`
- **Variable value**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- **Select group**: `app_store_credentials`
- Click **Add** or **Save**

**Variable 2: APP_STORE_KEY_ID**
- **Variable name**: `APP_STORE_KEY_ID`
- **Variable value**: `4GFW8YSP2G`
- **Select group**: `app_store_credentials`
- Click **Add** or **Save**

**Variable 3: APP_STORE_PRIVATE_KEY**
- **Variable name**: `APP_STORE_PRIVATE_KEY`
- **Variable value**: [Full content from your `.p8` file]
  - Should look like:
    ```
    -----BEGIN PRIVATE KEY-----
    MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
    ... (many lines) ...
    -----END PRIVATE KEY-----
    ```
- **Select group**: `app_store_credentials`
- Click **Add** or **Save**

### Step 3: Verify Group in codemagic.yaml

Make sure your `codemagic.yaml` references this group:

```yaml
environment:
  groups:
    - app_store_credentials  # This should match your group name
```

## Method 4: Direct URL (If Available)

Try these direct URLs:

- **Personal Account**: https://codemagic.io/teams/personal/integrations
- **Team Account**: https://codemagic.io/teams/[your-team]/integrations
- **Account Settings**: https://codemagic.io/account

## Visual Guide

Look for these sections in Codemagic:
- ✅ **"Integrations"** tab
- ✅ **"Apple Developer Portal"** section
- ✅ **"Manage keys"** button
- ✅ **"Create key"** or **"Add key"** button

## What to Do If You Still Can't Find It

1. **Check your account type**
   - Personal account → Use Method 1 (Teams → Personal Account)
   - Team account → Use Method 1 (Team settings → Team integrations)

2. **Use Method 3 (Environment Variables)**
   - This always works and is the most reliable
   - Add the three variables as described above
   - Your `codemagic.yaml` already references `app_store_credentials` group

3. **Contact Codemagic Support**
   - If you still can't find it, the UI might have changed
   - Use environment variables (Method 3) as a workaround

## After Adding the API Key

1. **Verify it's working**
   - Start a new build
   - Check build logs for: "=== Code Signing Configuration ==="
   - Should see your Issuer ID and Key ID

2. **If using environment variables**
   - Make sure group name matches `codemagic.yaml` line 11
   - Currently set to: `app_store_credentials`

## Quick Checklist

- [ ] Found "Integrations" or "Apple Developer Portal" section
- [ ] Added API key (or added 3 environment variables)
- [ ] Verified group name matches `codemagic.yaml`
- [ ] Ready to test build

**Recommended**: Use **Method 3 (Environment Variables)** if you can't find the integrations section. It's the most straightforward and always works!

