# Purchase Flow Update

## ✅ What Was Updated

The purchase flow in `YourOrder.js` has been updated to follow the TTelgo API flow as specified in `MOBILE_APP_QUICK_START.md`.

## 📋 New API Functions Added

The following functions have been added to `src/services/api.js`:

1. **`createPaymentIntent(paymentData)`** - Creates a payment intent with Stripe
2. **`confirmPayment(paymentIntentId)`** - Confirms payment after Stripe processing
3. **`activateESIMAfterPayment(orderId)`** - Activates eSIM after payment confirmation
4. **`getOrderById(orderId)`** - Gets order details using numeric ID
5. **`getOrderByReference(orderReference)`** - Gets order details using UUID reference
6. **`getESIMQRCodeByMatchingId(matchingId)`** - Gets QR code for eSIM installation

## 🔄 Purchase Flow (Following Guide)

The purchase flow now follows these steps:

### Step 1: Create Payment Intent
```javascript
POST /api/payments/intent
Headers: X-API-Key: ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0
Body: {
  amount: 29.99,
  currency: "usd",
  bundleId: "esim_1GB_7D_GB_V2",
  bundleName: "UK eSIM 1GB 7 Days",
  quantity: 1,
  customerEmail: "user@example.com"
}
```

### Step 2: Process Payment (Stripe)
- Currently simulated with an alert
- **TODO**: Integrate Stripe React Native SDK

### Step 3: Confirm Payment
```javascript
POST /api/payments/confirm?paymentIntentId=pi_xxx
Headers: X-API-Key: ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0
```

### Step 4: Activate eSIM
```javascript
POST /api/esims/activate-after-payment?orderId=123
Headers: X-API-Key: ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0
```

### Step 5: Get Order Details
```javascript
GET /api/orders/123
Headers: X-API-Key: ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0
```

## ⚠️ Important: Stripe Integration Required

Currently, the payment processing step is **simulated** with an alert dialog. For production, you need to:

1. **Install Stripe React Native SDK:**
   ```bash
   npm install @stripe/stripe-react-native
   ```

2. **Initialize Stripe:**
   ```javascript
   import { initStripe } from '@stripe/stripe-react-native';
   
   await initStripe({
     publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
   });
   ```

3. **Process Payment:**
   ```javascript
   import { useStripe } from '@stripe/stripe-react-native';
   
   const { confirmPayment } = useStripe();
   
   const { paymentIntent, error } = await confirmPayment(clientSecret, {
     paymentMethodType: 'Card',
   });
   ```

4. **Update `handleCompletePurchase`** in `YourOrder.js` to use actual Stripe payment instead of the simulation.

## 🔑 API Keys

- **TTelgo API Key**: `ttelgo_yaAx_20DZgRR2MTOLWbdvIqQ7rxKVIDfbxTb8D1wjj0` (configured in `api.js`)
- **Base URL**: `https://www.ttelgo.com/api`

## 📝 Notes

1. **Customer Email**: Currently hardcoded as `'user@example.com'`. Update to get from user profile/auth.

2. **Error Handling**: All API calls include proper error handling with user-friendly messages.

3. **Order ID Types**: The API supports both numeric IDs (`/api/orders/123`) and UUID references (`/api/orders/reference/{uuid}`).

4. **Bundle ID Format**: Bundle IDs follow the format: `esim_{data}GB_{days}D_{countryCode}_V2`
   - Example: `esim_1GB_7D_GB_V2`

## 🧪 Testing

To test the purchase flow:

1. Select a bundle/plan
2. Click "Complete Purchase"
3. Click "Simulate Payment Success" (for testing)
4. The flow will:
   - Create payment intent
   - Confirm payment
   - Activate eSIM
   - Get order details
   - Show success message

## 🚀 Next Steps

1. ✅ API functions added
2. ✅ Purchase flow updated
3. ⏳ **Integrate Stripe SDK** (required for production)
4. ⏳ Get customer email from user profile
5. ⏳ Add order details screen
6. ⏳ Add eSIM installation screen with QR code

## 📚 Reference

See `MOBILE_APP_QUICK_START.md` for complete API documentation and flow details.

