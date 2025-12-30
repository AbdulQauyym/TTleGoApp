# Quick Fix: Add API Key as Environment Variables

## You're Already on the Right Page! 🎯

You're on the **Environment Variables** page. This is the **easiest way** to add your App Store Connect API key.

## Step-by-Step (3 Variables)

### Step 1: Create Group (If Needed)

1. **Click "Select group"** button (next to the variable input fields)
2. **Click "Create new group"** or **"New group"**
3. **Type**: `app_store_credentials`
4. **Click "Create"** or **"Save"**

### Step 2: Add First Variable

**Variable Name:**
```
APP_STORE_ISSUER_ID
```

**Variable Value:**
```
b79b1792-7bf3-4b25-b677-2161ea034aa8
```

**Select Group:**
```
app_store_credentials
```

**Click "Add" or "Save"**

### Step 3: Add Second Variable

**Variable Name:**
```
APP_STORE_KEY_ID
```

**Variable Value:**
```
4GFW8YSP2G
```

**Select Group:**
```
app_store_credentials
```

**Click "Add" or "Save"**

### Step 4: Add Third Variable

**Variable Name:**
```
APP_STORE_PRIVATE_KEY
```

**Variable Value:**
```
-----BEGIN PRIVATE KEY-----
[paste the entire content from your AuthKey_4GFW8YSP2G.p8 file here]
-----END PRIVATE KEY-----
```

**Important:** 
- Include the `-----BEGIN PRIVATE KEY-----` line
- Include all the content in the middle
- Include the `-----END PRIVATE KEY-----` line
- Copy the ENTIRE file content

**Select Group:**
```
app_store_credentials
```

**Click "Add" or "Save"**

## Verify

After adding all 3 variables, you should see:

```
app_store_credentials
├── APP_STORE_ISSUER_ID
├── APP_STORE_KEY_ID
└── APP_STORE_PRIVATE_KEY
```

## That's It!

Your `codemagic.yaml` already references `app_store_credentials` (line 11), so the build will automatically use these variables.

## Next Steps

1. **Commit your code** (if you made changes)
2. **Start a new build** in Codemagic
3. **Check build logs** - Should see your Issuer ID and Key ID

## Troubleshooting

**If variables don't appear:**
- Make sure you selected the group `app_store_credentials` for each variable
- Refresh the page
- Check that group name matches exactly: `app_store_credentials` (no spaces, lowercase)

**If build still fails:**
- Verify all 3 variables are in the same group
- Check that private key includes BEGIN/END markers
- Make sure group name in `codemagic.yaml` matches exactly

---

**This method works 100% of the time!** No need to find hidden menus or special permissions.

