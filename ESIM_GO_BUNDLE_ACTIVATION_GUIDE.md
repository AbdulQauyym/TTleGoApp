# Complete Guide: Activate a Bundle Using eSIM Go API v2.4

## Overview

This guide explains how to activate a bundle (purchase and assign to eSIM) using the eSIM Go API v2.4. The process involves creating an order, which automatically purchases the bundle and assigns it to an eSIM.

## Prerequisites

1. **eSIM Go Account**: You need an active eSIM Go account
2. **API Key**: Get your API key from:
   - Log into https://sso.esim-go.com/login
   - Navigate to **Account Settings → API Details**
   - Copy your API key
3. **Account Balance**: Ensure your account has sufficient balance to purchase the bundle
4. **Bundle Name**: Know the exact bundle name (case-sensitive) from the [Bundle Catalogue](https://docs.esim-go.com/api/v2_4/operations/catalogue/get/)

## API Base URL

```
https://api.esim-go.com/v2.4
```

## Authentication

All API requests require the `X-API-Key` header:

```http
X-API-Key: YOUR_API_KEY
```

## Step-by-Step Guide

### Step 1: Create an Order (Activate Bundle)

**Endpoint:** `POST /orders`

**URL:** `https://api.esim-go.com/v2.4/orders`

**Headers:**
```http
Content-Type: application/json
X-API-Key: YOUR_API_KEY
Accept: application/json
```

**Request Body Format:**

According to the eSIM Go API documentation, the request body should contain the order details directly:

```json
{
  "type": "transaction",
  "assign": true,
  "quantity": 1,
  "item": "BUNDLE_NAME"
}
```

**OR** (if using orderItems array format):

```json
{
  "orderItems": [
    {
      "type": "transaction",
      "quantity": 1,
      "item": "BUNDLE_NAME",
      "assign": true
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | `"transaction"` (purchase) or `"validate"` (test without charging) |
| `assign` | boolean | Yes | `true` to assign to new eSIM, `false` to just purchase |
| `quantity` | number | Yes | Number of bundles to order (usually 1) |
| `item` | string | Yes | **Exact bundle name** (case-sensitive, e.g., `"esim_1GB_7D_GB_V2"`) |
| `iccid` | string | No | ICCID of existing eSIM (if assigning to existing eSIM) |

**Example Request (cURL):**

```bash
curl -X POST "https://api.esim-go.com/v2.4/orders" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Accept: application/json" \
  -d '{
    "type": "transaction",
    "assign": true,
    "quantity": 1,
    "item": "esim_1GB_7D_GB_V2"
  }'
```

**Example Request (JavaScript/Fetch):**

```javascript
const response = await fetch('https://api.esim-go.com/v2.4/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    type: 'transaction',
    assign: true,
    quantity: 1,
    item: 'esim_1GB_7D_GB_V2'
  })
});

const data = await response.json();
console.log('Order created:', data);
```

**Success Response (200 OK):**

```json
{
  "orderReference": "ORDER-REF-12345",
  "total": 29.99,
  "currency": "USD",
  "status": "completed",
  "esims": [
    {
      "iccid": "8944538532008160222",
      "status": "assigned"
    }
  ]
}
```

**Error Responses:**

- **400 Bad Request**: Invalid request body or missing required fields
  ```json
  {
    "error": "Order must contain Order Items",
    "message": "Bad Request: Order must contain Order Items. Please check your order data."
  }
  ```

- **401/403 Unauthorized**: Invalid or missing API key
  ```json
  {
    "error": "Access denied",
    "message": "Invalid API key"
  }
  ```

- **402 Payment Required**: Insufficient account balance
  ```json
  {
    "error": "Insufficient balance",
    "message": "Account balance is too low to complete this order"
  }
  ```

### Step 2: Get Order Details (Optional)

**Endpoint:** `GET /orders/{orderReference}`

**URL:** `https://api.esim-go.com/v2.4/orders/{orderReference}`

**Example:**

```bash
curl -X GET "https://api.esim-go.com/v2.4/orders/ORDER-REF-12345" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Accept: application/json"
```

### Step 3: Get eSIM Installation Details

**Endpoint:** `GET /esims/assignments?reference={orderReference}`

**URL:** `https://api.esim-go.com/v2.4/esims/assignments?reference={orderReference}`

**OR** (if you have the ICCID):

**Endpoint:** `GET /esims/{iccid}/install`

**URL:** `https://api.esim-go.com/v2.4/esims/{iccid}/install`

**Example:**

```bash
curl -X GET "https://api.esim-go.com/v2.4/esims/assignments?reference=ORDER-REF-12345" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Accept: application/json"
```

**Success Response:**

```json
[
  {
    "iccid": "8944538532008160222",
    "smdpAddress": "LPA:1$smdp.example.com$ABC123",
    "matchingId": "ABC123",
    "activationCode": "ABC123",
    "qrCode": "data:image/png;base64,..."
  }
]
```

### Step 4: Install eSIM on Device

Use the installation details to install the eSIM:

1. **QR Code**: If provided, scan with device camera
2. **Manual Entry**: Use SM-DP+ address and activation code (matching ID)
3. **LPA URL**: Use the LPA format URL: `LPA:1$smdpAddress$matchingId`

## Important Notes

### Bundle Names

- **Case-sensitive**: Bundle names are case-sensitive
- **Exact match required**: Must match exactly as shown in the catalogue
- **Examples:**
  - ✅ `esim_1GB_7D_GB_V2`
  - ❌ `ESIM_1GB_7D_GB_V2` (wrong case)
  - ❌ `esim_1gb_7d_gb_v2` (wrong case)

### Order Types

- **`"transaction"`**: Creates a real order and charges your account
- **`"validate"`**: Tests the order without charging (useful for validation)

### Assigning to eSIM

- **`assign: true`**: Automatically creates/assigns to a new eSIM
- **`assign: false`**: Just purchases the bundle (you assign later)
- **`iccid`**: Optional, use if assigning to existing eSIM

### Testing

Before going live, test with:
```json
{
  "type": "validate",
  "assign": true,
  "quantity": 1,
  "item": "esim_1GB_7D_GB_V2"
}
```

This validates the order without charging your account.

## Complete Example (React Native)

```javascript
import { createESIMOrder, getESIMInstallDetails } from './services/api';

async function activateBundle(bundleName) {
  try {
    // Step 1: Create order (activate bundle)
    const orderResponse = await createESIMOrder({
      bundleName: bundleName,
      quantity: 1,
      assign: true,
      type: 'transaction'
    });
    
    const orderReference = orderResponse.orderReference;
    console.log('Order created:', orderReference);
    
    // Step 2: Wait a moment for eSIM to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Get installation details
    const installDetails = await getESIMInstallDetails(orderReference, {
      format: 'json'
    });
    
    console.log('Installation details:', installDetails);
    
    // Step 4: Install eSIM (use installDetails.smdpAddress and installDetails.matchingId)
    return installDetails;
    
  } catch (error) {
    console.error('Error activating bundle:', error);
    throw error;
  }
}
```

## Troubleshooting

### Error: "Order must contain Order Items"

**Cause:** Request body format is incorrect

**Solution:** Ensure the request body contains either:
- Direct fields: `{ type, assign, quantity, item }`
- OR `orderItems` array: `{ orderItems: [{ type, quantity, item, assign }] }`

### Error: "Access denied"

**Cause:** Invalid or missing API key

**Solution:**
1. Verify API key is correct
2. Check API key is in the `X-API-Key` header
3. Ensure API key has proper permissions

### Error: "Bundle not found"

**Cause:** Bundle name is incorrect

**Solution:**
1. Verify bundle name from catalogue
2. Check case sensitivity
3. Ensure bundle is available in your account

### Error: "Insufficient balance"

**Cause:** Account balance is too low

**Solution:**
1. Top up your account balance
2. Check order total vs. available balance

## References

- [eSIM Go API v2.4 Documentation](https://docs.esim-go.com/api/v2_4/)
- [Create Orders Endpoint](https://docs.esim-go.com/api/v2_4/operations/orders/post/)
- [Get Order Detail](https://docs.esim-go.com/api/v2_4/operations/ordersreference/get/)
- [Get eSIM Install Details](https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/)
- [Bundle Catalogue](https://docs.esim-go.com/api/v2_4/operations/catalogue/get/)

## Support

For additional help:
- eSIM Go Support: https://help.esim-go.com
- API Documentation: https://docs.esim-go.com/api/v2_4/











