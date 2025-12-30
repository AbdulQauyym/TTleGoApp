# Where to Find App Store Connect API Key in Codemagic

Since you can't find the "Teams → Integrations" section, here are **ALL possible locations** with visual descriptions:

## Method 1: Environment Variables (EASIEST - You're Already There!)

**You're already on the Environment Variables page!** This is the easiest method:

### Visual Guide:
```
┌─────────────────────────────────────────┐
│  Codemagic - TTleGoApp Settings        │
├─────────────────────────────────────────┤
│  [codemagic.yaml] [Environment vars] ← YOU ARE HERE
│                                         │
│  Application environment variables      │
│                                         │
│  Variable name: [___________]          │
│  =                                      │
│  Variable value: [___________]         │
│  [Select group ▼]                       │
│                                         │
│  No existing variables                  │
└─────────────────────────────────────────┘
```

### Steps:
1. **Click "Select group"** button
2. **Click "Create new group"** or **"New group"**
3. **Name it**: `app_store_credentials`
4. **Add 3 variables** (one at a time):

   **Variable 1:**
   - Name: `APP_STORE_ISSUER_ID`
   - Value: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - Group: `app_store_credentials`

   **Variable 2:**
   - Name: `APP_STORE_KEY_ID`
   - Value: `4GFW8YSP2G`
   - Group: `app_store_credentials`

   **Variable 3:**
   - Name: `APP_STORE_PRIVATE_KEY`
   - Value: [Full content from `.p8` file]
   - Group: `app_store_credentials`

---

## Method 2: Teams → Integrations (If Available)

### Visual Guide:
```
┌─────────────────────────────────────────┐
│  Codemagic                              │
├─────────────────────────────────────────┤
│  [Dashboard] [Teams] ← CLICK HERE       │
│  [Apps] [Settings]                       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Teams                              │ │
│  ├───────────────────────────────────┤ │
│  │ [Personal Account] ← CLICK HERE   │ │
│  │ [Your Team Name]                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Personal Account                   │ │
│  ├───────────────────────────────────┤ │
│  │ [Overview] [Integrations] ← HERE │ │
│  │ [Members] [Billing]                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Integrations                       │ │
│  ├───────────────────────────────────┤ │
│  │ Apple Developer Portal             │ │
│  │ [Manage keys] ← CLICK HERE         │ │
│  │                                    │ │
│  │ GitHub                             │ │
│  │ Bitbucket                          │ │
│  │ GitLab                             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Steps:
1. **Top Navigation Bar** → Click **"Teams"**
2. **Left Sidebar** → Click **"Personal Account"** (or your team name)
3. **Tabs** → Click **"Integrations"**
4. **Find Section** → **"Apple Developer Portal"**
5. **Click** → **"Manage keys"**
6. **Click** → **"Create key"** or **"Add key"**

---

## Method 3: Account Settings

### Visual Guide:
```
┌─────────────────────────────────────────┐
│  Codemagic                              │
├─────────────────────────────────────────┤
│  [Dashboard] [Teams] [Apps]             │
│                                         │
│  [Your Profile Icon] ← CLICK HERE       │
│  └─ [Account settings]                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Account Settings                  │ │
│  ├───────────────────────────────────┤ │
│  │ [Profile] [Integrations] ← HERE    │ │
│  │ [Security] [Billing]               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Integrations                       │ │
│  ├───────────────────────────────────┤ │
│  │ Apple Developer Portal             │ │
│  │ [Manage keys] ← CLICK HERE         │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Steps:
1. **Top Right** → Click your **Profile Icon** (avatar)
2. **Dropdown Menu** → Click **"Account settings"**
3. **Left Sidebar** → Click **"Integrations"**
4. **Find Section** → **"Apple Developer Portal"**
5. **Click** → **"Manage keys"**

---

## Method 4: Direct URL (Try These)

If you're logged in, try these direct URLs:

1. **Personal Account Integrations:**
   ```
   https://codemagic.io/teams/personal/integrations
   ```

2. **Team Integrations:**
   ```
   https://codemagic.io/teams/[your-team-name]/integrations
   ```

3. **Account Settings:**
   ```
   https://codemagic.io/account
   ```

---

## What to Look For

When you find the right page, you should see:

```
┌─────────────────────────────────────────┐
│  Apple Developer Portal                 │
├─────────────────────────────────────────┤
│  Manage your App Store Connect API keys  │
│                                         │
│  [Create key] or [Add key] button      │
│                                         │
│  Existing keys:                          │
│  - (list of keys if any)                │
└─────────────────────────────────────────┘
```

When you click "Create key", you'll see a form:

```
┌─────────────────────────────────────────┐
│  Create API Key                         │
├─────────────────────────────────────────┤
│  Name: [________________]               │
│  Issuer ID: [________________]          │
│  Key ID: [________________]             │
│  Private Key: [Upload file] or [Paste] │
│                                         │
│  [Cancel]  [Save]                      │
└─────────────────────────────────────────┘
```

---

## Recommended: Use Environment Variables

**Since you're already on the Environment Variables page, use Method 1!**

It's:
- ✅ **Easier** - No need to find hidden menus
- ✅ **Always available** - Works on all Codemagic accounts
- ✅ **More reliable** - Direct control over variables
- ✅ **Already configured** - Your `codemagic.yaml` references `app_store_credentials`

### Quick Steps (Environment Variables):

1. **Click "Select group"** → **"Create new group"**
2. **Name**: `app_store_credentials`
3. **Add 3 variables:**
   - `APP_STORE_ISSUER_ID` = `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - `APP_STORE_KEY_ID` = `4GFW8YSP2G`
   - `APP_STORE_PRIVATE_KEY` = [your .p8 file content]

That's it! Your build will automatically use these variables.

---

## Still Can't Find It?

If you still can't find the Integrations section:

1. **Check your account type:**
   - Personal account → Look for "Teams" in top nav
   - Team account → Look for team name in top nav

2. **Check permissions:**
   - You might need admin/owner permissions
   - Contact your team admin if you don't have access

3. **Use Environment Variables:**
   - This always works and doesn't require special permissions
   - You're already on the right page!

---

## After Adding Variables

Once you've added the 3 environment variables to the `app_store_credentials` group:

1. **Verify** - You should see 3 variables listed
2. **Start Build** - Go to dashboard and start a new build
3. **Check Logs** - Look for "=== Code Signing Configuration ==="
4. **Should Work** - Build should use automatic signing

---

**Bottom Line:** Use the **Environment Variables** method (Method 1) - it's the easiest and you're already on that page!

