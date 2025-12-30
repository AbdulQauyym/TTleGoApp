# API Key Verification

## Current Configuration

**TTelgo API Key:** `ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0`

**Location:** `src/services/api.js` line 6

## Verification Steps

The API key is already configured correctly in the code. If you're still getting "Access denied" errors, please check:

### 1. Verify API Key is Active
- Log into your TTelgo account
- Navigate to API settings
- Verify the key `ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0` is active
- Check if there are any restrictions (IP, rate limits, etc.)

### 2. Check Console Logs
When you click "Complete Purchase", check the console for:
- URL being called
- Request body being sent
- Response status
- Full error message

### 3. Test the Endpoint Directly
You can test the endpoint using curl or Postman:

```bash
curl -X POST https://ttelgo.com/api/esims/activate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0" \
  -d '{
    "type": "transaction",
    "assign": true,
    "order": [
      {
        "type": "bundle",
        "item": "esim_1GB_7D_GB_V2",
        "quantity": 1,
        "allowReassign": false
      }
    ]
  }'
```

### 4. Request Format
The code is sending:
```json
{
  "type": "transaction",
  "assign": true,
  "order": [
    {
      "type": "bundle",
      "item": "esim_1GB_7D_GB_V2",
      "quantity": 1,
      "allowReassign": false
    }
  ]
}
```

This matches the guide format exactly.

## Current Implementation

✅ API key is set: `ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0`
✅ Endpoint: `POST https://ttelgo.com/api/esims/activate`
✅ Request format: Matches guide exactly
✅ Headers: `X-API-Key` header included

## Troubleshooting

If you still get "Access denied":

1. **Check API Key Status**: Verify the key is active in your TTelgo account
2. **Check Account Balance**: Ensure your account has sufficient funds
3. **Check Bundle Name**: Verify the bundle name exists in your account
4. **Check Console Logs**: Look for detailed error messages
5. **Test with Validate**: Try `type: 'validate'` first to test without charging

## Next Steps

1. Check the console logs when clicking "Complete Purchase"
2. Look for the detailed request/response logs
3. Share the console output if the error persists

The API key is correctly configured. The error might be due to:
- API key not being active in your account
- Account restrictions
- Bundle name not existing
- Insufficient account balance

