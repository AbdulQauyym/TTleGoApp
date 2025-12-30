# Purchase Flow - Using eSIM Go API v2.4 Directly

## Overview

The purchase flow in `YourOrder.js` has been updated to use the eSIM Go API v2.4 orders endpoint directly: `https://api.esim-go.com/v2.4/orders`

## What Changed

### Before
- Used TTelgo payment flow (`/api/payments/intent`, `/api/payments/confirm`)
- Required Stripe integration
- Multiple steps: Payment Intent → Payment → Confirmation → Activation

### After
- Uses eSIM Go API v2.4 directly
- Single step: Create Order → Get Details → Get QR Code
- No payment processing needed (uses account balance)

## Purchase Flow

### Step 1: Extract Bundle Information
```javascript
// Gets bundle ID from route params or constructs it
let bundleId = orderDetails.bundleName || orderDetails.bundleId;
```

### Step 2: Verify Bundle (Optional)
```javascript
await fetchPlanDetails(bundleId); // Validates bundle exists
```

### Step 3: Create Order
```javascript
const orderResponse = await createESIMOrder({
  bundleName: bundleId,
  quantity: 1,
  assign: true,        // Assign to new eSIM
  type: 'transaction'  // or 'validate' for testing
});
```

**API Endpoint:** `POST https://api.esim-go.com/v2.4/orders`

**Request Body:**
```json
{
  "type": "transaction",
  "quantity": 1,
  "item": "esim_1GB_7D_GB_V2",
  "assign": true
}
```

**Response:**
```json
{
  "orderReference": "ORDER-REF-12345",
  "total": 29.99,
  ...
}
```

### Step 4: Get Order Details
```javascript
const orderDetails = await getOrderDetails(orderReference);
```

**API Endpoint:** `GET https://api.esim-go.com/v2.4/orders/{orderReference}`

### Step 5: Get eSIM Installation Details (QR Code)
```javascript
const installDetails = await getESIMInstallDetails(orderReference, { 
  format: 'json' 
});
```

**API Endpoint:** `GET https://api.esim-go.com/v2.4/esims/assignments?reference={orderReference}`

## Account Requirements

1. **API Key**: Must be configured in `src/services/api.js`
   ```javascript
   const ESIM_GO_API_KEY = 'your-api-key-here';
   ```

2. **Account Balance**: eSIM Go uses a pre-paid model
   - Ensure your account has sufficient balance
   - Top up via bank card or BACS transfer through the portal

3. **Valid Bundle Names**: Bundle IDs must match exactly what's in your eSIM Go account

## Testing

Before making actual purchases, test with `type: 'validate'`:

```javascript
const testOrder = await createESIMOrder({
  bundleName: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  type: 'validate' // Won't charge your account
});
```

## Error Handling

The flow includes comprehensive error handling:
- **Invalid Bundle ID**: Validates bundle exists before ordering
- **Insufficient Balance**: API will return error if account balance is too low
- **Invalid API Key**: Returns 401/403 error
- **Network Errors**: Handled with user-friendly messages

## Success Flow

1. Order created successfully
2. Order reference received
3. Order details fetched
4. Installation details (QR code) retrieved
5. User can install eSIM using QR code

## Navigation

After successful purchase, the app navigates to:
- **ESIMInstall screen** (if QR code is available)
- **Back to previous screen** (if QR code not yet available)

## API Documentation

- **Orders Endpoint**: https://docs.esim-go.com/api/v2_4/operations/orders/post/
- **Order Details**: https://docs.esim-go.com/api/v2_4/operations/ordersreference/get/
- **Installation Details**: https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/
- **Full API Docs**: https://docs.esim-go.com/api/v2_4/

## Benefits

✅ **Simpler Flow**: One API call instead of multiple steps
✅ **No Payment Processing**: Uses account balance directly
✅ **Official API**: Uses official eSIM Go API v2.4
✅ **Better Error Handling**: Clear error messages
✅ **Testing Support**: Can validate orders without charging

## Notes

- The order is charged immediately from your eSIM Go account balance
- QR codes may not be available immediately after order creation
- Bundle names must match exactly (case-sensitive)
- Account must have sufficient balance before ordering

