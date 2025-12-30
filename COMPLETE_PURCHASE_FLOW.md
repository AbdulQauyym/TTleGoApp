# Complete Purchase Flow - eSIM Go API Integration

## Overview

The purchase flow in `YourOrder.js` has been fully implemented to:
1. ✅ Get order details from the page
2. ✅ Create order using eSIM Go API v2.4
3. ✅ Purchase the bundle (automatically when order is created)
4. ✅ Get eSIM installation details
5. ✅ Install the eSIM on the device

## Complete Flow

### Step 1: Extract Order Information
- Gets bundle ID from route params (`orderDetails.bundleName`)
- Falls back to constructing bundle ID if not provided
- Validates bundle ID format

### Step 2: Verify Bundle (Optional)
- Verifies bundle exists in the system
- Helps catch invalid bundle IDs early

### Step 3: Create Order
**API:** `POST https://api.esim-go.com/v2.4/orders`

```javascript
const orderResponse = await createESIMOrder({
  bundleName: bundleId,
  quantity: 1,
  assign: true,        // Automatically assigns to new eSIM
  type: 'transaction'  // Creates actual order (charges account)
});
```

**What happens:**
- ✅ Order is created
- ✅ Bundle is **automatically purchased** (charged from account balance)
- ✅ eSIM is **automatically assigned** (if `assign: true`)
- ✅ Order reference is returned

### Step 4: Get Order Details
**API:** `GET https://api.esim-go.com/v2.4/orders/{orderReference}`

Retrieves full order information including:
- Order status
- eSIM details (if assigned)
- Bundle information

### Step 5: Get eSIM Installation Details
**API:** `GET https://api.esim-go.com/v2.4/esims/assignments?reference={orderReference}`

**Features:**
- ⏱️ Waits 2 seconds for eSIM to be ready
- 🔄 Retries up to 3 times (with exponential backoff)
- 📦 Handles both single and array responses
- 🔗 Gets installation URL (LPA format)

**Returns:**
- SMDP+ address
- Matching ID
- ICCID
- Installation URL (LPA format)
- QR code data (if available)

### Step 6: Install eSIM

**Option 1: Direct Installation (Automatic)**
- Opens installation URL using `Linking.openURL()`
- Triggers device's native eSIM installation flow
- Works on both iOS and Android

**Option 2: Manual Installation**
- Navigates to `ESIMInstallScreen`
- Shows QR code
- Displays SMDP+ address and matching ID
- Provides step-by-step instructions

## User Experience

### Success Flow:
1. User clicks "Complete Purchase"
2. Loading indicator shows
3. Order is created and bundle is purchased
4. eSIM installation details are retrieved
5. Alert shows success with options:
   - **"Install Now"** - Opens device installation flow
   - **"View Details"** - Shows installation screen
   - **"Later"** - Returns to previous screen

### Installation Options:

**If installation URL is available:**
```
"Install Now" → Opens device settings → User follows on-screen instructions
```

**If installation details available but no URL:**
```
"Install eSIM" → Navigates to ESIMInstallScreen → Shows QR code and details
```

**If details not ready yet:**
```
"Check Installation" → Navigates to ESIMInstallScreen → Retries fetching details
```

## Key Features

### ✅ Automatic Bundle Purchase
- Bundle is purchased automatically when order is created
- No separate payment step needed
- Uses account balance (pre-paid model)

### ✅ Automatic eSIM Assignment
- eSIM is automatically assigned when `assign: true`
- No manual eSIM selection needed
- Ready for installation immediately

### ✅ Retry Logic
- Waits for eSIM to be ready (2 seconds initial wait)
- Retries up to 3 times if details not available
- Exponential backoff between retries

### ✅ Error Handling
- Validates bundle ID before ordering
- Handles network errors gracefully
- Provides user-friendly error messages
- Falls back to manual installation if automatic fails

### ✅ Cross-Platform Support
- Works on both iOS and Android
- Uses platform-specific installation URLs
- Handles device-specific installation flows

## API Endpoints Used

1. **Create Order:** `POST /v2.4/orders`
2. **Get Order Details:** `GET /v2.4/orders/{orderReference}`
3. **Get Installation Details:** `GET /v2.4/esims/assignments?reference={orderReference}`

## Installation URL Format

The installation URL follows the LPA (Local Profile Assistant) format:
```
LPA:1$<smdpAddress>$<matchingId>
```

Example:
```
LPA:1$https://smdp.example.com$A1B2-C3D4-E5F6-G7H8
```

## Account Requirements

1. **API Key:** Must be configured in `src/services/api.js`
2. **Account Balance:** Must have sufficient funds (pre-paid model)
3. **Valid Bundle:** Bundle name must exist in your eSIM Go account

## Testing

To test without charging your account:
```javascript
type: 'validate'  // Instead of 'transaction'
```

This will validate the order without charging your account balance.

## Error Scenarios Handled

1. **Invalid Bundle ID:** Validated before ordering
2. **Insufficient Balance:** API returns error, shown to user
3. **eSIM Not Ready:** Retries with exponential backoff
4. **Installation URL Not Available:** Falls back to manual installation
5. **Network Errors:** Retried automatically
6. **API Errors:** User-friendly error messages

## Navigation

After successful purchase:
- **ESIMInstallScreen:** Shows QR code and installation details
- **Previous Screen:** Returns if user chooses "Later"

## Next Steps

The purchase flow is now complete! When users click "Complete Purchase":
1. ✅ Order is created
2. ✅ Bundle is purchased
3. ✅ eSIM is assigned
4. ✅ Installation details are retrieved
5. ✅ User can install eSIM immediately

The bundle purchase happens automatically when the order is created with `assign: true` and `type: 'transaction'`.

