# Apple Developer API Key Setup

## Your Key Information

- **Key ID**: `7N33Y5K6LG`
- **Private Key File**: `AuthKey_7N33Y5K6LG.p8`
- **Issuer ID**: [Find this in App Store Connect - see instructions below]

## Finding Your Issuer ID

1. Go to https://appstoreconnect.apple.com/
2. Sign in with your Apple Developer account
3. Click your name/account icon (top right)
4. Navigate to **Users and Access** → **Keys** tab
5. Your **Issuer ID** is displayed at the top of the Keys page
   - Format: UUID (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

## Secure Storage

**IMPORTANT**: Never commit your private key to version control!

### Option 1: Environment Variables (Recommended)

Create a `.env` file (add to `.gitignore`):

```env
APPLE_KEY_ID=7N33Y5K6LG
APPLE_ISSUER_ID=your-issuer-id-here
APPLE_PRIVATE_KEY_PATH=./AuthKey_7N33Y5K6LG.p8
```

### Option 2: Secure File Location

1. Store the `.p8` file outside your project directory
2. Reference it with an absolute path
3. Add to `.gitignore`:

```
# Apple Developer Keys
*.p8
AuthKey_*.p8
.env
```

## Using in React Native

### For App Store Connect API

```javascript
// Example: Using for App Store Connect API
const APPLE_KEY_ID = '7N33Y5K6LG';
const APPLE_ISSUER_ID = 'your-issuer-id'; // Get from App Store Connect
const APPLE_PRIVATE_KEY = require('./AuthKey_7N33Y5K6LG.p8'); // Or read from file

// Use with libraries like:
// - @apple/app-store-connect-api
// - fastlane
// - codemagic
```

### For Fastlane

In your `Fastfile`:

```ruby
app_store_connect_api_key(
  key_id: "7N33Y5K6LG",
  issuer_id: "your-issuer-id-here",
  key_filepath: "./AuthKey_7N33Y5K6LG.p8"
)
```

### For Codemagic

In `codemagic.yaml`:

```yaml
app_store_connect:
  auth:
    issuer_id: your-issuer-id-here
    key_id: 7N33Y5K6LG
    key: $APP_STORE_PRIVATE_KEY  # Store as environment variable
```

## Security Best Practices

1. ✅ **DO**: Store keys in environment variables
2. ✅ **DO**: Add `.p8` files to `.gitignore`
3. ✅ **DO**: Use secure secret management services
4. ❌ **DON'T**: Commit private keys to Git
5. ❌ **DON'T**: Share private keys publicly
6. ❌ **DON'T**: Hardcode keys in source code

## Revoking and Regenerating

If your key is compromised:

1. Go to App Store Connect → Users and Access → Keys
2. Find key ID `7N33Y5K6LG`
3. Click "Revoke"
4. Create a new key
5. Download the new `.p8` file
6. Update all services using the old key

## Next Steps

1. Find your Issuer ID in App Store Connect
2. Store the key securely (environment variables or secure vault)
3. Add `.p8` files to `.gitignore`
4. Use the key for your intended purpose (CI/CD, API access, etc.)

