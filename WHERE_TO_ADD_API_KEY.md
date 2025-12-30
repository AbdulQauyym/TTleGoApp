# Where to Add App Store Connect API Key

## ✅ RECOMMENDED: Environment Variables Page

**You're already on the right page!** Use the Environment Variables method.

### Exact Location:

1. **Current Page:** 
   - You're on: `https://codemagic.io/app/693d9147a47ff251a6fb6e7a/settings`
   - Tab: **"Environment variables"**

2. **What You See:**
   ```
   ┌─────────────────────────────────────────┐
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

3. **Step-by-Step:**

   **Step 1: Create Group**
   - Click **"Select group"** button
   - Click **"Create new group"** or **"New group"**
   - Type: `app_store_credentials`
   - Click **Create** or **Save**

   **Step 2: Add First Variable**
   - **Variable name**: Type `APP_STORE_ISSUER_ID`
   - **Variable value**: Type `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - **Select group**: Choose `app_store_credentials`
   - Click **Add** or **Save**

   **Step 3: Add Second Variable**
   - **Variable name**: Type `APP_STORE_KEY_ID`
   - **Variable value**: Type `4GFW8YSP2G`
   - **Select group**: Choose `app_store_credentials`
   - Click **Add** or **Save**

   **Step 4: Add Third Variable**
   - **Variable name**: Type `APP_STORE_PRIVATE_KEY`
   - **Variable value**: Paste the ENTIRE content from your `.p8` file
     - Open `AuthKey_4GFW8YSP2G.p8` in a text editor
     - Copy everything (including BEGIN/END lines)
     - Paste it here
   - **Select group**: Choose `app_store_credentials`
   - Click **Add** or **Save**

4. **After Adding All 3:**
   - You should see:
     ```
     app_store_credentials
     ├── APP_STORE_ISSUER_ID
     ├── APP_STORE_KEY_ID
     └── APP_STORE_PRIVATE_KEY
     ```

---

## Alternative: Teams → Integrations (If You Can Find It)

**Only if you can locate this section:**

1. **Top Navigation** → Click **"Teams"**
2. **Left Sidebar** → Click **"Personal Account"**
3. **Tabs** → Click **"Integrations"**
4. **Find Section** → **"Apple Developer Portal"**
5. **Click** → **"Manage keys"**
6. **Click** → **"Create key"**
7. **Fill in the form:**
   - Name: `TTelGo App Store Connect API`
   - Issuer ID: `b79b1792-7bf3-4b25-b677-2161ea034aa8`
   - Key ID: `4GFW8YSP2G`
   - Private Key: Upload `.p8` file or paste content
8. **Click** → **"Save"**

**If you can't find this, use the Environment Variables method above!**

---

## Visual Guide: Environment Variables Page

```
┌─────────────────────────────────────────────────────┐
│  Codemagic - TTleGoApp Settings                     │
├─────────────────────────────────────────────────────┤
│  [codemagic.yaml] [Environment variables] ← YOU ARE HERE
│                                                     │
│  Application environment variables                  │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ Variable name: [APP_STORE_ISSUER_ID]          │ │ ← Type here
│  │ =                                             │ │
│  │ Variable value: [b79b1792-7bf3-4b25...]     │ │ ← Type here
│  │ [Select group: app_store_credentials ▼]      │ │ ← Select here
│  │ [Add] or [Save]                              │ │ ← Click here
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  After adding, you'll see:                         │
│  ┌───────────────────────────────────────────────┐ │
│  │ app_store_credentials                        │ │
│  │   ├── APP_STORE_ISSUER_ID                    │ │
│  │   ├── APP_STORE_KEY_ID                       │ │
│  │   └── APP_STORE_PRIVATE_KEY                  │ │
│  └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Quick Summary

**Where to add it:** Environment Variables page (you're already there!)

**What to add:**
1. Create group: `app_store_credentials`
2. Add variable: `APP_STORE_ISSUER_ID` = `b79b1792-7bf3-4b25-b677-2161ea034aa8`
3. Add variable: `APP_STORE_KEY_ID` = `4GFW8YSP2G`
4. Add variable: `APP_STORE_PRIVATE_KEY` = [your .p8 file content]

**That's it!** Your build will automatically use these variables.

