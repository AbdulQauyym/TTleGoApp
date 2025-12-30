# Codemagic Environment Variables Setup Guide

## Current Page: Environment Variables

You're currently on the **Environment variables** page. However, for App Store Connect API credentials, you need to add them in a **different section**.

## Option 1: Add App Store Connect API Key (Recommended)

The App Store Connect API key should be added in the **Codemagic API** section, not here. This automatically creates an environment group.

### Steps:

1. **Go to Settings**
   - Click **Settings** (gear icon) in the top right
   - Or navigate to: Settings → **Codemagic API** → **App Store Connect API keys**

2. **Add API Key**
   - Click **"Add API key"** or **"New API key"**
   - Fill in:
     - **Name**: `TTelGo App Store Connect API`
     - **Issuer ID**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
     - **Key ID**: `4GFW8YSP2G`
     - **Private Key**: [Full content from `AuthKey_4GFW8YSP2G.p8`]
   - Click **Save**

3. **Verify Group Created**
   - After saving, Codemagic automatically creates an environment group
   - Go back to: **Environment variables** page
   - You should now see a group (e.g., `app_store_credentials`)
   - This group contains: `APP_STORE_ISSUER_ID`, `APP_STORE_KEY_ID`, `APP_STORE_PRIVATE_KEY`

## Option 2: Create Environment Group Manually (If Needed)

If you prefer to add variables manually on this page:

### Step 1: Create a Group

1. **Click "Select group"** button (next to the variable input fields)
2. **Click "Create new group"** or **"New group"**
3. **Name it**: `app_store_credentials`
4. **Save the group**

### Step 2: Add Variables to the Group

Add these three variables one by one:

**Variable 1:**
- **Variable name**: `APP_STORE_ISSUER_ID`
- **Variable value**: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
- **Select group**: `app_store_credentials`
- Click **Add** or **Save**

**Variable 2:**
- **Variable name**: `APP_STORE_KEY_ID`
- **Variable value**: `4GFW8YSP2G`
- **Select group**: `app_store_credentials`
- Click **Add** or **Save**

**Variable 3:**
- **Variable name**: `APP_STORE_PRIVATE_KEY`
- **Variable value**: [Full content from `AuthKey_4GFW8YSP2G.p8` file, including BEGIN/END markers]
- **Select group**: `app_store_credentials`
- Click **Add** or **Save**

## Recommended Approach

**Use Option 1** (Add App Store Connect API key in Settings → Codemagic API). This is the recommended way because:
- ✅ Codemagic handles the setup automatically
- ✅ Properly formats the credentials
- ✅ Creates the environment group automatically
- ✅ Less error-prone

## After Adding API Key

1. **Verify Group Exists**
   - Go back to: **Environment variables** page
   - You should see the group with the three variables

2. **Verify Group Name**
   - Note the exact group name
   - It should match line 29 in your `codemagic.yaml`: `app_store_credentials`
   - If it's different, update `codemagic.yaml` line 29

3. **Start Build**
   - Go to dashboard
   - Click "Start new build"
   - The build should now use the API credentials automatically

## Current Status

On the Environment variables page, you see:
- "No existing variables" - This is normal if you haven't added the API key yet
- Input fields ready to add variables
- "Select group" button to organize variables

## Next Steps

1. **Go to Settings → Codemagic API → App Store Connect API keys**
2. **Add your API key** with the credentials
3. **Return to Environment variables** to verify the group was created
4. **Start a new build**

The environment variables page is for **custom variables**. App Store Connect API keys should be added in the **Codemagic API** section for automatic setup.

