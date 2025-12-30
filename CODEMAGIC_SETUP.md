# Codemagic iOS Build Setup Guide

## Step 1: Create App Store Connect API Key

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Sign in with your Apple Developer account
3. Navigate to **Users and Access** → **Keys** tab
4. Click the **+** button to create a new key
5. Enter a name for the key (e.g., "Codemagic CI/CD")
6. Select **App Manager** or **Admin** role
7. Click **Generate**
8. **IMPORTANT**: Download the `.p8` key file immediately (you can only download it once!)
9. Note down:
   - **Issuer ID** (shown at the top of the Keys page)
   - **Key ID** (shown in the key name)
   - **Private Key** (the `.p8` file content)

## Step 2: Add API Key to Codemagic

1. Go to [Codemagic Dashboard](https://codemagic.io/)
2. Click on your **Account Settings** (top right corner)
3. Navigate to **Codemagic API** → **App Store Connect API keys**
4. Click **Add new API key**
5. Fill in the following:
   - **Name**: Give it a descriptive name (e.g., "iOS App Store Key")
   - **Issuer ID**: Paste the Issuer ID from Step 1
   - **Key ID**: Paste the Key ID from Step 1
   - **Private Key**: Open the `.p8` file you downloaded and copy its entire content (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
6. Click **Save**

## Step 3: Add API Key to Your App's Environment Variables

1. In Codemagic, go to your app: **TTleGoApp**
2. Click on **Settings** (gear icon)
3. Go to **Environment variables** tab
4. Add the following variables (they should be automatically available if you added the API key in Step 2):
   - `APP_STORE_ISSUER_ID` - Your Issuer ID
   - `APP_STORE_KEY_ID` - Your Key ID
   - `APP_STORE_PRIVATE_KEY` - Your Private Key content

   **OR** if using environment groups:
   - Go to **Environment groups**
   - Create or edit the `app_store_credentials` group
   - Add the three variables above

## Step 4: Verify Configuration

Your `codemagic.yaml` file is already configured to use these credentials. The workflow references:
- Environment group: `app_store_credentials`
- Variables: `$APP_STORE_ISSUER_ID`, `$APP_STORE_KEY_ID`, `$APP_STORE_PRIVATE_KEY`

## Step 5: Test the Build

1. Commit and push your changes to GitHub
2. In Codemagic, trigger a new build
3. The build should now have access to your App Store Connect API key

## Troubleshooting

### If you get "Invalid API Key" error:
- Double-check that you copied the entire private key including the header and footer
- Ensure there are no extra spaces or line breaks
- Verify the Issuer ID and Key ID are correct

### If you get "Access Denied" error:
- Make sure the API key has the correct role (App Manager or Admin)
- Check that the key is not expired or revoked

### If variables are not found:
- Ensure the environment group name matches: `app_store_credentials`
- Check that variables are added to the correct app/environment group
- Verify variable names match exactly: `APP_STORE_ISSUER_ID`, `APP_STORE_KEY_ID`, `APP_STORE_PRIVATE_KEY`

## Notes

- The API key is used for code signing and App Store distribution
- Keep your `.p8` file secure - never commit it to Git
- You can create multiple API keys for different purposes
- API keys don't expire, but can be revoked if needed
