# eSIM Go API v2.4 Integration

## Overview

The API service has been updated to follow the official eSIM Go API v2.4 documentation from https://docs.esim-go.com/api/v2_4/operations

## Base URL
```
https://api.esim-go.com/v2.4
```

## Authentication
All requests require the `X-API-Key` header:
```javascript
headers: {
  'X-API-Key': 'YOUR_ESIM_GO_API_KEY',
  'Content-Type': 'application/json'
}
```

## Updated Functions

### 1. `createESIMOrder(orderData)`

Creates an order using eSIM Go API v2.4.

**Request Body Structure:**
```javascript
{
  type: 'transaction',        // 'transaction' or 'validate' (for testing)
  quantity: 1,                // Number of bundles
  item: 'esim_1GB_7D_GB_V2', // Bundle name
  assign: true,              // Assign to new eSIM (default: true)
  iccid: 'optional'          // Optional: assign to existing eSIM
}
```

**Example:**
```javascript
const order = await createESIMOrder({
  bundleName: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  assign: true,
  type: 'transaction' // or 'validate' for testing
});

// Response includes:
// - orderReference: Use this to get QR code
// - total: Order total
```

**Reference:** https://docs.esim-go.com/api/v2_4/operations/orders/post/

### 2. `applyBundleToESIM(iccid, bundleName)`

Applies a bundle to an existing eSIM.

**Endpoint:** `POST /v2.4/esims/{iccid}/bundles`

**Example:**
```javascript
const result = await applyBundleToESIM('8944123456789012345', 'esim_1GB_7D_GB_V2');
```

**Reference:** https://docs.esim-go.com/api/v2_4/operations/esimsiccidbundles/post/

### 3. `getOrderDetails(orderReference)`

Gets order details by order reference.

**Endpoint:** `GET /v2.4/orders/{orderReference}`

**Example:**
```javascript
const orderDetails = await getOrderDetails('ORDER-REF-12345');
```

**Reference:** https://docs.esim-go.com/api/v2_4/operations/ordersreference/get/

### 4. `getESIMInstallDetails(reference, options)`

Gets eSIM installation details (SMDP+ address, matching ID, QR code).

**Endpoint:** `GET /v2.4/esims/assignments?reference={reference}`

**Example:**
```javascript
// Get JSON details
const details = await getESIMInstallDetails('ORDER-REF-12345', { format: 'json' });

// Get QR code ZIP file
const qrZip = await getESIMInstallDetails('ORDER-REF-12345', { format: 'zip' });
```

**Reference:** https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/

## Complete Purchase Flow (eSIM Go API Direct)

If TTelgo payment endpoints don't exist, you can use eSIM Go API directly:

```javascript
import { createESIMOrder, getOrderDetails, getESIMInstallDetails } from '../services/api';

// Step 1: Create order (account must have sufficient balance)
const order = await createESIMOrder({
  bundleName: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  assign: true,
  type: 'transaction' // Use 'validate' to test without charging
});

// Step 2: Get order details
const orderDetails = await getOrderDetails(order.orderReference);

// Step 3: Get QR code for installation
const qrCode = await getESIMInstallDetails(order.orderReference, { format: 'zip' });
```

## Testing Orders

Before making actual purchases, test with `type: 'validate'`:

```javascript
const testOrder = await createESIMOrder({
  bundleName: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  type: 'validate' // This won't charge your account
});
```

## Account Requirements

1. **Account Balance**: eSIM Go operates on a pre-paid model. Ensure your account has sufficient balance.
2. **API Key**: Get your API key from Account Settings > API Details
3. **Top Up**: Add funds via bank card or BACS transfer through the portal

## Error Handling

All functions include comprehensive error handling:
- **401/403**: Invalid API key
- **400**: Bad request (invalid parameters)
- **404**: Resource not found
- **429**: Rate limiting
- **503**: Service unavailable

## Bundle Name Format

Bundle names typically follow this format:
```
esim_{dataAmount}GB_{days}D_{countryCode}_V2
```

Examples:
- `esim_1GB_7D_GB_V2` (UK, 1GB, 7 days)
- `esim_5GB_30D_US_V2` (USA, 5GB, 30 days)
- `esim_10GB_15D_FR_V2` (France, 10GB, 15 days)

## References

- **Full API Documentation**: https://docs.esim-go.com/api/v2_4/
- **Operations List**: https://docs.esim-go.com/api/v2_4/operations
- **Ordering Guide**: https://docs.esim-go.com/guides/ordering/
- **Account Setup**: https://docs.esim-go.com/guides/setup_esimgo_account/

## Notes

- All API calls are logged to console for debugging
- Response structures are handled flexibly (wrapped or unwrapped)
- Error messages are user-friendly and actionable
- All functions validate API key before making requests

