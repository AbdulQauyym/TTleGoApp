# TTelgo Purchase Flow - Complete Guide

## Overview

The purchase flow has been updated to use the TTelgo API endpoints as specified in your guide. This flow is simpler and uses TTelgo's own API instead of eSIM Go API directly.

## Complete Flow

### Step 1: List Bundles (Already Implemented)
**Endpoint:** `GET https://ttelgo.com/api/plans/bundles`
**Or by country:** `GET https://ttelgo.com/api/plans/bundles/country?countryIso=GB`

**Purpose:** Get list of available bundles
**Status:** ✅ Already implemented in `fetchCountries()` and `fetchCountryPlans()`

### Step 2: Get Bundle Detail (Already Implemented)
**Endpoint:** `GET https://ttelgo.com/api/plans/bundles/{bundleName}`

**Example:** `GET https://ttelgo.com/api/plans/bundles/esim_1GB_7D_GB_V2`

**Purpose:** Get detailed information about a specific bundle
**Status:** ✅ Already implemented in `fetchPlanDetails()`

### Step 3: Activate Bundle (NEW)
**Endpoint:** `POST https://ttelgo.com/api/esims/activate`

**Request Body:**
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

**Response:**
```json
{
  "orderReference": "0dbcfea0-072d-432c-98a6-b29d34ddb1cf",
  ...
}
```

**What happens:**
- ✅ Bundle is activated
- ✅ eSIM is assigned (if `assign: true`)
- ✅ Order reference is returned

**Status:** ✅ Implemented in `activateBundle()`

### Step 4: Get QR Code
**Endpoint:** `GET https://ttelgo.com/api/esims/qr/{orderReference}`

**Example:** `GET https://ttelgo.com/api/esims/qr/0dbcfea0-072d-432c-98a6-b29d34ddb1cf`

**Purpose:** Get QR code for eSIM installation
**Response:** QR code image (PNG) or JSON with QR code data

**Status:** ✅ Implemented in `getQRCodeByOrderReference()`

## Updated Purchase Flow in YourOrder.js

When user clicks "Complete Purchase":

1. **Extract Bundle ID** from order details
2. **Verify Bundle** exists (optional)
3. **Activate Bundle** using `POST /api/esims/activate`
4. **Get Order Reference** from activation response
5. **Get QR Code** using `GET /api/esims/qr/{orderReference}`
6. **Show Success** with option to view QR code

## API Functions

### `activateBundle(activateData)`

Activates a bundle using TTelgo API.

**Parameters:**
```javascript
{
  bundleName: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  assign: true,
  allowReassign: false,
  type: 'transaction' // or 'validate' for testing
}
```

**Returns:**
```javascript
{
  orderReference: '0dbcfea0-072d-432c-98a6-b29d34ddb1cf',
  ...
}
```

### `getQRCodeByOrderReference(orderReference)`

Gets QR code for eSIM installation.

**Parameters:**
- `orderReference` (string): Order reference from activate API

**Returns:**
- Blob (image) or JSON object with QR code data

## Request Format

The activate endpoint expects:
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

**Key Points:**
- `order` is an **array** (not `orderItems`)
- Each item has `type: "bundle"`
- `item` contains the bundle name
- `assign: true` assigns to new eSIM
- `allowReassign: false` prevents reassignment

## Testing

To test without charging:
```javascript
type: 'validate'  // Instead of 'transaction'
```

## Error Handling

All functions include comprehensive error handling:
- **400 Bad Request**: Invalid request data
- **401/403**: Invalid API key
- **404**: Resource not found
- **Network errors**: Retried automatically

## User Experience

### Success Flow:
1. User clicks "Complete Purchase"
2. Loading indicator shows
3. Bundle is activated
4. QR code is retrieved
5. Success alert with options:
   - **"View QR Code"** - Shows QR code screen
   - **"OK"** - Returns to previous screen

### If QR Code Not Ready:
- Shows success message
- Provides option to check QR code later
- Navigates to installation screen which will retry

## API Endpoints Used

1. **Activate Bundle:** `POST https://ttelgo.com/api/esims/activate`
2. **Get QR Code:** `GET https://ttelgo.com/api/esims/qr/{orderReference}`

## API Key

**TTelgo API Key:** `ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0`

Configured in `src/services/api.js` as `TTELGO_API_KEY`

## Benefits

✅ **Simpler Flow**: Only 2 API calls (activate + get QR code)
✅ **TTelgo Native**: Uses TTelgo's own API
✅ **Direct Activation**: Bundle is activated immediately
✅ **QR Code Ready**: QR code available right after activation

## Notes

- The bundle is activated and purchased when the activate API is called
- eSIM is automatically assigned if `assign: true`
- QR code may take a few seconds to be ready (retry logic included)
- Order reference is used to get the QR code

## Complete Example

```javascript
// Step 1: Activate bundle
const activateResponse = await activateBundle({
  bundleName: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  assign: true,
  type: 'transaction'
});

// Step 2: Get order reference
const orderReference = activateResponse.orderReference;

// Step 3: Get QR code
const qrCode = await getQRCodeByOrderReference(orderReference);

// Step 4: Display QR code to user
```

The purchase flow is now complete and follows the TTelgo API guide exactly!

