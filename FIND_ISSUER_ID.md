# How to Find Your App Store Connect Issuer ID

## Where to Find Issuer ID

The **Issuer ID** is NOT on the Users page. It's located in the **API Keys** section.

### Step-by-Step:

1. **Go to App Store Connect**: https://appstoreconnect.apple.com/
2. **Sign in** with your Apple Developer account
3. **Navigate to**: **Users and Access** (in the top navigation)
4. **Click on the "Keys" tab** (not "Users" tab)
5. **Look at the top of the Keys page** - you'll see:
   - **Issuer ID**: `12345678-1234-1234-1234-123456789012` (example format)
   - This is displayed prominently at the top

## Visual Guide:

```
App Store Connect
├── Users and Access
    ├── Users tab (for managing users)
    ├── Keys tab ← GO HERE for Issuer ID
    │   └── Issuer ID: [shown at top of page]
    └── Access tab
```

## What You'll See:

On the **Keys** tab, you'll see:
- **Issuer ID** at the top (this is what you need)
- List of API keys below
- Each key shows:
  - Key name
  - Key ID
  - Download button (for .p8 file)

## Quick Access:

Direct link to Keys page:
https://appstoreconnect.apple.com/access/api

This page shows:
- ✅ **Issuer ID** (at the top)
- ✅ Your API keys list
- ✅ Option to create new keys

## Summary:

- ❌ **NOT** in: Users page (https://appstoreconnect.apple.com/access/users)
- ✅ **IS** in: Keys/API page (https://appstoreconnect.apple.com/access/api)

The Issuer ID is a UUID format string like: `12345678-1234-1234-1234-123456789012`







