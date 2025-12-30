# eSIM Installation Guide

This guide explains how to install eSIMs in your React Native app using the eSIM Go API v2.4.

## Overview

The eSIM installation process involves:
1. **Creating an Order** - Purchase an eSIM bundle
2. **Getting Install Details** - Retrieve SMDP+ address and matching ID
3. **Installing the eSIM** - Use the details to install on the device

## API Reference

The implementation uses the [eSIM Go API v2.4](https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/) endpoint:
- **Endpoint**: `GET /esims/assignments`
- **Purpose**: Retrieves eSIM SMDP+ details needed for installation
- **Documentation**: https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/

## Implementation Details

### 1. API Functions

All eSIM installation functions are in `src/services/api.js`:

#### `getESIMInstallDetails(reference, options)`
Retrieves eSIM installation details from the API.

**Parameters:**
- `reference` (string, required): Order Reference or Apply Reference
- `options` (object, optional):
  - `format`: `'json'` (default), `'csv'`, or `'zip'` (for QR codes)
  - `additionalFields`: Additional fields like `'appleInstallUrl'`

**Returns:**
- JSON format: Object or array with eSIM details
- CSV format: CSV text string
- ZIP format: Blob containing QR code images

**Example:**
```javascript
import { getESIMInstallDetails } from './src/services/api';

// Get JSON details
const details = await getESIMInstallDetails('ORDER-12345', { format: 'json' });
console.log(details);
// {
//   iccid: "8944123456789012345",
//   matchingId: "A1B2-C3D4-E5F6-G7H8",
//   smdpAddress: "http://smdp.example.com",
//   profileStatus: "Released",
//   pin: "1234",
//   puk: "12345678",
//   firstInstalledDateTime: "2023-06-15T14:30:00.000Z"
// }

// Get QR code ZIP file
const qrZip = await getESIMInstallDetails('ORDER-12345', { format: 'zip' });
```

#### `getESIMInstallURL(reference)`
Convenience function that constructs the installation URL in LPA format.

**Returns:** Installation URL string (e.g., `LPA:1$http://smdp.example.com$A1B2-C3D4-E5F6-G7H8`)

**Example:**
```javascript
import { getESIMInstallURL } from './src/services/api';

const installURL = await getESIMInstallURL('ORDER-12345');
// Returns: "LPA:1$http://smdp.example.com$A1B2-C3D4-E5F6-G7H8"
```

#### `getESIMQRCode(reference)`
Gets the QR code as a ZIP file containing PNG images.

**Example:**
```javascript
import { getESIMQRCode } from './src/services/api';

const qrZip = await getESIMQRCode('ORDER-12345');
// Returns: Blob containing ZIP file with QR code images
```

### 2. Complete Installation Flow

Here's a complete example of the eSIM installation flow:

```javascript
import { 
  createESIMOrder, 
  getOrderDetails, 
  getESIMInstallDetails,
  getESIMInstallURL 
} from './src/services/api';
import { Linking } from 'react-native';

async function purchaseAndInstallESIM(bundleName) {
  try {
    // Step 1: Create an order
    const orderResult = await createESIMOrder({
      bundleName: bundleName,
      quantity: 1,
      autoAssign: true
    });
    
    console.log('Order created:', orderResult);
    const orderReference = orderResult.reference || orderResult.orderReference;
    
    // Step 2: Get order details (optional, to verify)
    const orderDetails = await getOrderDetails(orderReference);
    console.log('Order details:', orderDetails);
    
    // Step 3: Get eSIM install details
    const installDetails = await getESIMInstallDetails(orderReference, {
      format: 'json',
      additionalFields: 'appleInstallUrl'
    });
    
    // Handle array response (multiple eSIMs)
    const esimData = Array.isArray(installDetails) ? installDetails[0] : installDetails;
    
    console.log('eSIM Details:', {
      iccid: esimData.iccid,
      smdpAddress: esimData.smdpAddress,
      matchingId: esimData.matchingId,
      profileStatus: esimData.profileStatus
    });
    
    // Step 4: Get installation URL
    const installURL = await getESIMInstallURL(orderReference);
    console.log('Install URL:', installURL);
    
    // Step 5: Open installation URL (triggers device installation flow)
    const canOpen = await Linking.canOpenURL(installURL);
    if (canOpen) {
      await Linking.openURL(installURL);
    } else {
      // Fallback: Show manual instructions
      console.log('Manual installation required');
      console.log('SMDP+ Address:', esimData.smdpAddress);
      console.log('Matching ID:', esimData.matchingId);
    }
    
    return {
      success: true,
      orderReference,
      installDetails: esimData,
      installURL
    };
    
  } catch (error) {
    console.error('Error installing eSIM:', error);
    throw error;
  }
}

// Usage
purchaseAndInstallESIM('esim_1GB_7D_GB_V2')
  .then(result => console.log('Installation started:', result))
  .catch(error => console.error('Failed:', error));
```

### 3. Using the ESIMInstallScreen Component

The app includes a ready-to-use component at `src/components/ESIMInstallScreen.js`:

```javascript
import ESIMInstallScreen from './src/components/ESIMInstallScreen';

// In your navigation
<Stack.Screen 
  name="ESIMInstall" 
  component={ESIMInstallScreen} 
/>

// Navigate to it with a reference
navigation.navigate('ESIMInstall', {
  reference: 'ORDER-12345' // Order Reference or Apply Reference
});
```

The component automatically:
- Fetches eSIM installation details
- Displays ICCID, SMDP+ address, and matching ID
- Shows installation instructions
- Provides an "Install eSIM" button
- Allows sharing installation details

### 4. Installation Methods

#### Method 1: Direct URL Installation (Recommended)
```javascript
const installURL = await getESIMInstallURL(reference);
await Linking.openURL(installURL);
```

This opens the device's eSIM installation flow directly.

#### Method 2: QR Code Scanning
1. Get QR code ZIP file
2. Extract and display QR code image
3. User scans with device camera
4. Device automatically installs eSIM

```javascript
const qrZip = await getESIMQRCode(reference);
// Extract and display QR code image
// User scans with device
```

#### Method 3: Manual Entry
1. Display SMDP+ address and matching ID
2. User manually enters in device settings
3. Device downloads and installs eSIM

```javascript
const details = await getESIMInstallDetails(reference);
// Display details.smdpAddress and details.matchingId
// User enters manually in Settings
```

### 5. Platform-Specific Instructions

#### iOS Installation Steps:
1. Go to **Settings** → **Cellular**
2. Tap **"Add Cellular Plan"**
3. Scan QR code or enter SMDP+ details manually
4. Follow on-screen instructions
5. Wait for activation (usually instant)

#### Android Installation Steps:
1. Go to **Settings** → **Network & Internet** → **Mobile network**
2. Tap **"Download a SIM instead"** or **"Add eSIM"**
3. Scan QR code or enter SMDP+ address
4. Follow on-screen instructions
5. Wait for activation (usually instant)

### 6. Response Format

The API returns different formats based on the `Accept` header:

#### JSON Format (Default)
```json
{
  "iccid": "8944123456789012345",
  "matchingId": "A1B2-C3D4-E5F6-G7H8",
  "smdpAddress": "http://smdp.example.com",
  "profileStatus": "Released",
  "pin": "1234",
  "puk": "12345678",
  "firstInstalledDateTime": "2023-06-15T14:30:00.000Z"
}
```

#### CSV Format
Returns comma-separated values with eSIM details.

#### ZIP Format
Returns a ZIP file containing QR code images in PNG format.

### 7. Error Handling

The API functions handle common errors:

- **400 Bad Request**: Invalid reference format
- **401/403 Unauthorized**: Invalid API key
- **429 Too Many Requests**: Rate limiting
- **500 Server Error**: Server-side issue
- **503 Service Unavailable**: Temporary unavailability (check `Retry-After` header)

Example error handling:
```javascript
try {
  const details = await getESIMInstallDetails(reference);
} catch (error) {
  if (error.message.includes('Access denied')) {
    // Check API key configuration
  } else if (error.message.includes('Too many requests')) {
    // Wait before retrying
  } else {
    // Handle other errors
  }
}
```

### 8. Integration with Order Flow

Here's how to integrate with the existing order flow:

```javascript
// In YourOrder.js or similar component
import { 
  createESIMOrder, 
  getOrderDetails,
  getESIMInstallURL 
} from '../services/api';

async function handlePurchase(planDetails) {
  try {
    // Create order
    const orderResult = await createESIMOrder({
      bundleName: planDetails.bundleName,
      quantity: 1
    });
    
    const orderReference = orderResult.reference;
    
    // Navigate to installation screen
    navigation.navigate('ESIMInstall', {
      reference: orderReference
    });
    
  } catch (error) {
    Alert.alert('Error', error.message);
  }
}
```

### 9. Testing

To test the eSIM installation:

1. **Create a test order** using the eSIM Go API
2. **Get the order reference** from the response
3. **Use the reference** to fetch install details
4. **Test on a real device** (eSIM installation doesn't work in simulators)

```javascript
// Test function
async function testESIMInstallation() {
  const testReference = 'YOUR_TEST_ORDER_REFERENCE';
  
  try {
    const details = await getESIMInstallDetails(testReference);
    console.log('Install details:', details);
    
    const installURL = await getESIMInstallURL(testReference);
    console.log('Install URL:', installURL);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}
```

### 10. Important Notes

1. **API Key**: Ensure your eSIM Go API key is configured in `src/services/api.js`
2. **Device Support**: eSIM installation only works on devices that support eSIM
3. **Network Required**: Device needs internet connection to download eSIM profile
4. **One-Time Use**: Each eSIM can only be installed on one device
5. **Reference Format**: Use Order Reference or Apply Reference (not ICCID)

### 11. Troubleshooting

**Issue**: "Access denied" error
- **Solution**: Check your API key in `src/services/api.js`

**Issue**: "No eSIM data found"
- **Solution**: Verify the reference is correct and the order exists

**Issue**: Installation URL doesn't open
- **Solution**: Use manual entry method with SMDP+ address and matching ID

**Issue**: QR code not displaying
- **Solution**: Extract PNG from ZIP file and display using Image component

## Additional Resources

- [eSIM Go API Documentation](https://docs.esim-go.com/api/v2_4/)
- [eSIM Go API v2.4 Assignments Endpoint](https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/)
- [React Native Linking API](https://reactnative.dev/docs/linking)

## Support

For API-related issues, contact eSIM Go support at support@esim-go.com

