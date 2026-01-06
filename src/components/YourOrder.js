import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TextInput, Dimensions, Alert, ActivityIndicator, Linking, Platform, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';
import { 
  createOrder,
  createESIMOrder,
  getQRCode,
  getESIMInstallDetails,
  getESIMInstallURL,
  getOrderDetails,
  fetchPlanDetails 
} from '../services/api';

export default function YourOrder({ navigation, route }) {
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });

  useEffect(() => {
    // Use safe dimensions utility
    const safeDimensions = require('../utils/dimensions').getSafeWindowDimensions();
    setDimensions(safeDimensions);
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      try {
        if (window && typeof window.width === 'number' && typeof window.height === 'number') {
          setDimensions({ width: window.width, height: window.height });
        }
      } catch (e) {
        setDimensions({ width: 375, height: 667 });
      }
    });

    return () => {
      try {
        subscription?.remove();
      } catch (e) {}
    };
  }, []);

  const SCREEN_HEIGHT = dimensions?.height || 667;
  const HEADER_HEIGHT = SCREEN_HEIGHT * 0.38; // 38% of screen height
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Germany');
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isFetchingQR, setIsFetchingQR] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState(false);
  const [orderReference, setOrderReference] = useState(null);
  const [matchingId, setMatchingId] = useState(null);
  const [iccid, setIccid] = useState(null);
  
  const creditCardImg = require("../assets/credit_card.png");
  const paypalImg = require("../assets/paypal.png");
  const bankTransferImg = require("../assets/bank_transfer.png");
  
  // Country list with flags
  const countries = [
    { name: 'Germany', flag: 'de' },
    { name: 'United States', flag: 'us' },
    { name: 'United Kingdom', flag: 'gb' },
    { name: 'France', flag: 'fr' },
    { name: 'Italy', flag: 'it' },
    { name: 'Spain', flag: 'es' },
    { name: 'Switzerland', flag: 'ch' },
    { name: 'Portugal', flag: 'pt' },
    { name: 'Netherlands', flag: 'nl' },
    { name: 'Belgium', flag: 'be' },
    { name: 'Austria', flag: 'at' },
    { name: 'Greece', flag: 'gr' },
    { name: 'Poland', flag: 'pl' },
    { name: 'Sweden', flag: 'se' },
    { name: 'Norway', flag: 'no' },
    { name: 'Denmark', flag: 'dk' },
    { name: 'Finland', flag: 'fi' },
    { name: 'Ireland', flag: 'ie' },
    { name: 'Canada', flag: 'ca' },
    { name: 'Australia', flag: 'au' },
    { name: 'Japan', flag: 'jp' },
    { name: 'South Korea', flag: 'kr' },
    { name: 'China', flag: 'cn' },
    { name: 'India', flag: 'in' },
    { name: 'Brazil', flag: 'br' },
    { name: 'Mexico', flag: 'mx' },
    { name: 'Argentina', flag: 'ar' },
    { name: 'Chile', flag: 'cl' },
    { name: 'South Africa', flag: 'za' },
    { name: 'Egypt', flag: 'eg' },
    { name: 'Turkey', flag: 'tr' },
    { name: 'Russia', flag: 'ru' },
    { name: 'Timor-Leste', flag: 'tl' },
    { name: 'Togo', flag: 'tg' },
    { name: 'Tokelau', flag: 'tk' },
    { name: 'Tonga', flag: 'to' },
    { name: 'Trinidad & Tobago', flag: 'tt' },
    { name: 'Tristan da Cunha', flag: 'sh' },
    { name: 'Tunisia', flag: 'tn' },
  ];

  // Get order details from route params or use defaults
  const orderDetails = route?.params || {
    country: 'United States',
    flag: 'us',
    data: '20 GB',
    days: '30 Days',
    price: '35.18',
    oldPrice: '18',
    bundleName: null, // Bundle name from eSIM Go API
    iccid: null, // eSIM ICCID if available
  };

  // Handle complete purchase - Checkout and QR generation flow
  /**
   * Complete Purchase Flow - Following TTelgo API Documentation
   * Reference: MOBILE_API_DOCUMENTATION.md
   * 
   * Flow:
   * 1. Extract bundle information from order details
   * 2. Verify bundle exists (optional - ensures bundle name is valid)
   * 3. Create Order: POST /api/v1/esims/orders
   *    - Request body: { type: "transaction", assign: true, order: [{ type: "bundle", item: bundleName, quantity: 1 }] }
   *    - Response: { success: true, data: { orderReference: "...", order: [{ esims: [{ matchingId, iccid }] }] } }
   * 4. Extract orderReference from response (data.orderReference) - REQUIRED for QR Code API
   * 5. Get QR Code: GET /api/v1/esims/{orderReference}/qr
   *    - Uses orderReference from step 3 (NOT matchingId)
   *    - Response: { success: true, data: { qrCode: "...", matchingId: "...", iccid: "..." } }
   * 6. Display QR code to user for eSIM installation
   */
  const handleCompletePurchase = async () => {
    // Prevent duplicate submissions
    if (isProcessing || isCreatingOrder || isFetchingQR) {
      console.warn('⚠️ Purchase already in progress, ignoring duplicate submission');
      return;
    }

    setIsProcessing(true);
    setIsCreatingOrder(true);

    try {
      // Step 1: Extract bundle information from order details
      // Priority: Use bundleName from route params (actual bundle ID from API)
      let bundleId = orderDetails.bundleName || orderDetails.bundleId;
      
      console.log('📋 Step 0: Extracting bundle information...');
      console.log('📋 orderDetails.bundleName:', orderDetails.bundleName);
      console.log('📋 orderDetails.bundleId:', orderDetails.bundleId);
      console.log('📋 Full orderDetails:', JSON.stringify(orderDetails, null, 2));
      
      // If no bundle ID, try to construct it (fallback)
      if (!bundleId) {
        console.warn('⚠️ No bundleName found in orderDetails, attempting to construct...');
        // Construct bundle ID from order details
        // Format: esim_{data}_{days}_{country}_{version}
        // Example: esim_1GB_7D_GB_V2
        const dataAmount = orderDetails.data ? orderDetails.data.replace(' GB', '').replace(' GB', '').trim() : '1';
        const days = orderDetails.days ? orderDetails.days.replace(' Days', '').replace(' Day', '').trim() : '7';
        const countryCode = orderDetails.flag ? orderDetails.flag.toUpperCase() : 'GB';
        
        // Handle decimal data amounts (e.g., "1.5 GB" -> "1.5GB" or "1.5")
        const dataFormatted = dataAmount.includes('.') ? dataAmount.replace('.', '') : dataAmount;
        bundleId = `esim_${dataFormatted}GB_${days}D_${countryCode}_V2`;
        
        console.warn('⚠️ Constructed bundle ID (may not be correct):', bundleId);
        console.warn('⚠️ WARNING: Constructed bundle ID might not exist in the API. Please ensure bundleName is passed from the plan selection.');
      }

      // Validate bundle ID format
      if (!bundleId || typeof bundleId !== 'string' || bundleId.trim().length === 0) {
        throw new Error('Invalid bundle ID. Please go back and select a plan to get the correct bundle name.');
      }
      
      // Log the bundle ID that will be used
      console.log('✅ Using bundle ID:', bundleId);

      // Step 2: Verify bundle exists before creating order
      try {
        console.log('🔍 Step 0.5: Verifying bundle exists:', bundleId);
        const bundleDetails = await fetchPlanDetails(bundleId);
        console.log('✅ Bundle verified successfully:', bundleDetails?.name || bundleId);
        
        // If bundle details don't have a name, the bundle might not exist
        if (!bundleDetails || (!bundleDetails.name && !bundleDetails.bundleName)) {
          console.warn('⚠️ Bundle details missing name, but continuing...');
        }
      } catch (verifyError) {
        console.error('❌ Bundle verification failed:', verifyError.message);
        // Don't continue if bundle doesn't exist - this will cause the order to fail
        throw new Error(
          `Bundle verification failed: The bundle "${bundleId}" was not found.\n\n` +
          `Error: ${verifyError.message}\n\n` +
          `Please go back and select a valid plan.`
        );
      }
      
      // Step 3: Create Order using TTelgo API v1
      // API Documentation: MOBILE_API_DOCUMENTATION.md - Section 3
      // Endpoint: POST /api/v1/esims/orders
      // Request body: { type: "transaction", assign: true, order: [{ type: "bundle", item: bundleName, quantity: 1, allowReassign: false }] }
      console.log('🛒 Step 3: Creating eSIM order...');
      console.log('📦 Bundle ID:', bundleId);
      console.log('📦 Bundle ID type:', typeof bundleId);
      console.log('📦 Bundle ID length:', bundleId ? bundleId.length : 0);
      console.log('📦 Full orderDetails:', JSON.stringify(orderDetails, null, 2));
      
      // Ensure bundleId is a valid string
      if (!bundleId || typeof bundleId !== 'string' || bundleId.trim().length === 0) {
        throw new Error('Invalid bundle ID. Bundle name is required and must be a non-empty string.\n\nPlease go back and select a plan to get the correct bundle name.');
      }
      
      // Call API: https://ttelgo.com/api/v1/esims/orders
      console.log('🌐 Calling createOrder API with bundleName:', bundleId.trim());
      const orderResponse = await createOrder({
        bundleName: bundleId.trim(), // Trim whitespace
        quantity: 1,
        allowReassign: false,
      });
      
      setIsCreatingOrder(false);

      console.log('✅ Order created successfully:', orderResponse);
      console.log('📋 Order response structure:', JSON.stringify(orderResponse, null, 2));

      // Step 4: Extract orderReference from Create Order response
      // API Documentation: MOBILE_API_DOCUMENTATION.md - Section 3, line 260
      // Response structure: { success: true, data: { orderReference: "...", order: [{ esims: [{ matchingId, iccid }] }] } }
      // parseAPIResponse already extracts the 'data' field, so orderResponse contains the data object
      // IMPORTANT: orderReference is at data.orderReference (per documentation)
      let orderReference = null;
      let matchingId = null;
      let iccid = null;
      
      if (typeof orderResponse === 'object') {
        // Extract orderReference from data.orderReference (per API documentation line 260)
        // This orderReference MUST be used for Get QR Code API (NOT matchingId)
        orderReference = orderResponse.orderReference || orderResponse.reference;
        console.log('📋 Step 4: Extracted orderReference:', orderReference);
        
        // Extract matchingId and iccid from response structure (per API documentation)
        // Structure: data.order[0].esims[0].{matchingId, iccid}
        if (orderResponse.order && Array.isArray(orderResponse.order) && orderResponse.order.length > 0) {
          const firstOrderItem = orderResponse.order[0];
          console.log('📦 First order item:', JSON.stringify(firstOrderItem, null, 2));
          
          if (firstOrderItem.esims && Array.isArray(firstOrderItem.esims) && firstOrderItem.esims.length > 0) {
            const firstESIM = firstOrderItem.esims[0];
            matchingId = firstESIM.matchingId;
            iccid = firstESIM.iccid;
            console.log('🔑 Extracted matchingId:', matchingId);
            console.log('📱 Extracted ICCID:', iccid);
          }
        }
      }

      if (!orderReference) {
        console.error('❌ Order response:', orderResponse);
        throw new Error('Order created but no order reference received. Response: ' + JSON.stringify(orderResponse));
      }

      // Store order details in state for QR code modal
      setOrderReference(orderReference);
      setMatchingId(matchingId);
      setIccid(iccid);

      console.log('✅ Order Reference:', orderReference);
      console.log('✅ Matching ID:', matchingId);
      console.log('✅ ICCID:', iccid);

      // Step 5: Get QR Code using TTelgo API v1
      // API Documentation: MOBILE_API_DOCUMENTATION.md - Section 4
      // Endpoint: GET /api/v1/esims/{orderReference}/qr
      // IMPORTANT: Uses orderReference from Step 4 (NOT matchingId)
      // Dynamically replace {orderReference} with the actual value from Create Order response
      if (!orderReference) {
        throw new Error('Order created but no order reference received. Cannot get QR code.');
      }

      setIsFetchingQR(true);
      console.log('📱 Step 5: Fetching QR code for order reference:', orderReference);
      console.log('🌐 Calling QR API: GET /api/v1/esims/{orderReference}/qr');
      console.log('🌐 Full URL: https://ttelgo.com/api/v1/esims/' + orderReference + '/qr');
      
      // Wait a moment for eSIM to be ready (sometimes takes a few seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let qrCodeData = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      // Retry getting QR code (might not be ready immediately)
      while (retryCount < maxRetries && !qrCodeData) {
        try {
          qrCodeData = await getQRCode(orderReference);
          console.log('✅ QR code retrieved successfully');
          console.log('📦 QR Code data:', qrCodeData);
          break; // Success, exit retry loop
        } catch (qrError) {
          retryCount++;
          console.warn(`⚠️ QR code fetch attempt ${retryCount} failed:`, qrError.message);
          
          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            const waitTime = 2000 * retryCount;
            console.log(`⏳ Waiting ${waitTime}ms before retry ${retryCount + 1}...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
          } else {
            throw new Error(`Failed to get QR code after ${maxRetries} attempts: ${qrError.message}`);
          }
        }
      }

      setIsFetchingQR(false);

      // Set QR code data to state for display in modal
      setQrCodeData(qrCodeData);

      // Step 6: Display QR Code
      if (qrCodeData && qrCodeData.qrCode) {
        // QR code successfully retrieved - show success with options
        console.log('✅ QR Code generation complete!');
        Alert.alert(
          'Purchase Successful! 🎉',
          `Your eSIM order has been created successfully!\n\nOrder Reference: ${orderReference}\n\nQR Code is ready for installation.`,
          [
            {
              text: 'View QR Code',
              onPress: () => {
                // Open QR code modal
                setQrCodeModalVisible(true);
              },
            },
            {
              text: 'Install Now',
              onPress: async () => {
                // Navigate to installation screen with QR code data
                navigation.navigate('ESIMInstallScreen', {
                  reference: orderReference,
                  orderReference: orderReference,
                  matchingId: matchingId,
                  iccid: iccid,
                  qrCode: qrCodeData.qrCode,
                  qrCodeData: qrCodeData
                });
              },
            },
            {
              text: 'Later',
              style: 'cancel',
              onPress: () => {
                navigation.navigate('ManageMain');
              },
            },
          ]
        );
      } else {
        // QR code not available yet
        console.warn('⚠️ QR code not available in response');
        Alert.alert(
          'Order Created Successfully!',
          `Your eSIM order has been created!\n\nOrder Reference: ${orderReference}\n\nThe QR code will be available shortly. You can check back in a few moments.`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('ManageMain');
              },
            },
          ]
        );
      }

    } catch (error) {
      console.error('❌ Error completing purchase:', error);
      
      // Reset loading states on error
      setIsCreatingOrder(false);
      setIsFetchingQR(false);
      
      // Check if this is a credit-related error
      const isCreditError = error.isCreditError || 
                           error.message === 'INSUFFICIENT_CREDIT' ||
                           (error.message && (
                             error.message.toLowerCase().includes('credit') ||
                             error.message.toLowerCase().includes('insufficient') ||
                             error.message.toLowerCase().includes('not enough') ||
                             error.message.toLowerCase().includes('balance') ||
                             error.message.toLowerCase().includes('funds')
                           ));
      
      if (isCreditError) {
        // Show specific dialog for insufficient credit
        Alert.alert(
          'Insufficient Credit',
          'Your credit is not enough to complete this purchase. Please add more credit to your account and try again.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Keep user on the page so they can add credit and retry
              },
            },
          ]
        );
      } else {
        // Show generic error message for other errors
        Alert.alert(
          'Purchase Failed',
          error.message || 'Failed to complete purchase. Please check your connection and try again.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Keep user on the page so they can retry
              },
            },
          ]
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy QR code to clipboard
  const copyQRCodeToClipboard = () => {
    if (qrCodeData && qrCodeData.qrCode) {
      Clipboard.setString(qrCodeData.qrCode);
      Alert.alert('Copied!', 'QR code data has been copied to clipboard');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Your Order</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* Item (1) Card - Fixed on Header */}
      <View style={styles.fixedCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Item (1)</Text>
          <Image 
            source={{ uri: `https://flagcdn.com/w40/${orderDetails.flag}.png` }} 
            style={styles.flagIcon} 
          />
        </View>
        <Text style={styles.cardText}>{orderDetails.country}</Text>
        <Text style={styles.cardText}>{orderDetails.data} - {orderDetails.days}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>USD</Text>
          {orderDetails.oldPrice ? (
            <>
              <Text style={styles.oldPrice}>{orderDetails.oldPrice}</Text>
              <Text style={styles.newPrice}>{orderDetails.price}</Text>
            </>
          ) : (
            <Text style={styles.newPrice}>{orderDetails.price}</Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Add Payment Method Button */}
        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={() => setPaymentModalVisible(true)}
        >
          <Text style={styles.paymentButtonText}>Add Payment Method</Text>
        </TouchableOpacity>

        {/* Legal Text */}
      
        {/* Complete Purchase Button */}
        <TouchableOpacity 
          style={[styles.completeButton, (isProcessing || isCreatingOrder || isFetchingQR) && styles.completeButtonDisabled]}
          onPress={handleCompletePurchase}
          disabled={isProcessing || isCreatingOrder || isFetchingQR}
        >
          {isProcessing || isCreatingOrder || isFetchingQR ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadingButtonText}>
                {isCreatingOrder ? 'Creating Order...' : isFetchingQR ? 'Generating QR Code...' : 'Processing...'}
              </Text>
            </View>
          ) : (
            <Text style={styles.completeButtonText}>Complete Purchase</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Payment Method Selection Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select payment method</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Payment Options */}
            <TouchableOpacity 
              style={[
                styles.paymentOption,
                selectedPaymentMethod === 'card' && styles.paymentOptionSelected
              ]}
              onPress={() => setSelectedPaymentMethod('card')}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={[styles.paymentIcon, styles.cardIcon]}>
                  <Image source={creditCardImg} style={styles.creditCardImage} resizeMode="contain" />
                </View>
                <Text style={styles.paymentOptionText}>Card</Text>
              </View>
              {selectedPaymentMethod === 'card' && (
                <Icon name="checkmark-circle" size={24} color="#E53935" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.paymentOption,
                selectedPaymentMethod === 'paypal' && styles.paymentOptionSelected
              ]}
              onPress={() => setSelectedPaymentMethod('paypal')}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={[styles.paymentIcon, styles.paypalIcon]}>
                  <Image source={paypalImg} style={styles.paypalImage} resizeMode="contain" />
                </View>
                <Text style={styles.paymentOptionText}>PayPal</Text>
              </View>
              {selectedPaymentMethod === 'paypal' && (
                <Icon name="checkmark-circle" size={24} color="#E53935" />
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.paymentOption,
                selectedPaymentMethod === 'bank' && styles.paymentOptionSelected
              ]}
              onPress={() => setSelectedPaymentMethod('bank')}
            >
              <View style={styles.paymentOptionLeft}>
                <View style={[styles.paymentIcon, styles.bankIcon]}>
                  <Image source={bankTransferImg} style={styles.bankTransferImage} resizeMode="contain" />
                </View>
                <Text style={styles.paymentOptionText}>Add Bank Account</Text>
              </View>
              {selectedPaymentMethod === 'bank' && (
                <Icon name="checkmark-circle" size={24} color="#E53935" />
              )}
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity 
              style={[
                styles.modalContinueButton,
                !selectedPaymentMethod && styles.modalContinueButtonDisabled
              ]}
              onPress={() => {
                if (selectedPaymentMethod) {
                  if (selectedPaymentMethod === 'card') {
                    // Open Add Card modal
                    setPaymentModalVisible(false);
                    setCardModalVisible(true);
                  } else if (selectedPaymentMethod === 'bank') {
                    // Handle Bank Account selection
                    setPaymentModalVisible(false);
                    // Handle Bank Account payment method selection
                  } else {
                    // Handle PayPal selection
                    setPaymentModalVisible(false);
                    // Handle PayPal payment method selection
                  }
                }
              }}
              disabled={!selectedPaymentMethod}
            >
              <Text style={styles.modalContinueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Card Modal */}
      <Modal
        visible={cardModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCardModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Card</Text>
              <TouchableOpacity onPress={() => setCardModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Card Information Section */}
              <Text style={styles.sectionTitle}>Card Information</Text>
              
              {/* Card Number */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Card Number"
                  placeholderTextColor="#999"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />
                <Icon name="card" size={24} color="#2196F3" style={styles.inputIcon} />
              </View>

              {/* MM / YY and CVC Row */}
              <View style={styles.inputRow}>
                <View style={[styles.inputWrapper, styles.inputWrapperHalf]}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="MM / YY"
                    placeholderTextColor="#999"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputWrapper, styles.inputWrapperHalf]}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="CVC"
                    placeholderTextColor="#999"
                    value={cvc}
                    onChangeText={setCvc}
                    keyboardType="numeric"
                    secureTextEntry
                  />
                  <Icon name="card-outline" size={20} color="#999" style={styles.inputIcon} />
                </View>
              </View>

              {/* Billing Address Section */}
              <Text style={styles.sectionTitle}>Billing Address</Text>
              
              {/* Country Selection */}
              <TouchableOpacity 
                style={styles.countrySelector}
                onPress={() => setCountryPickerVisible(true)}
              >
                <Text style={styles.countryText}>{selectedCountry}</Text>
                <Icon name="chevron-down" size={20} color="#999" />
              </TouchableOpacity>

              {/* Disclaimer Text */}
              <Text style={styles.disclaimerText}>
                By providing your card information you allow Get TikTel App to charge your card for future payment in accordance with their terms
              </Text>

              {/* Continue Button */}
              <TouchableOpacity 
                style={styles.modalContinueButton}
                onPress={() => {
                  setCardModalVisible(false);
                  // Handle card addition
                }}
              >
                <Text style={styles.modalContinueButtonText}>Continue</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Country Picker Bottom Sheet */}
            {countryPickerVisible && (
              <View style={styles.countryPickerOverlay}>
                <TouchableOpacity 
                  style={styles.countryPickerBackdrop}
                  activeOpacity={1}
                  onPress={() => setCountryPickerVisible(false)}
                />
                <View style={styles.countryPickerSheet}>
                  {/* Picker Header */}
                  <View style={styles.countryPickerHeader}>
                    <TouchableOpacity onPress={() => setCountryPickerVisible(false)}>
                      <Text style={styles.countryPickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCountryPickerVisible(false)}>
                      <Text style={styles.countryPickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Country List */}
                  <ScrollView style={styles.countryPickerList}>
                    {countries.map((country, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.countryPickerItem,
                          selectedCountry === country.name && styles.countryPickerItemSelected
                        ]}
                        onPress={() => {
                          setSelectedCountry(country.name);
                          setCountryPickerVisible(false);
                        }}
                      >
                        <Image 
                          source={{ uri: `https://flagcdn.com/w40/${country.flag}.png` }} 
                          style={styles.countryPickerFlag} 
                        />
                        <Text style={styles.countryPickerItemText}>{country.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={qrCodeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQrCodeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrCodeModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>eSIM QR Code</Text>
              <TouchableOpacity onPress={() => setQrCodeModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {qrCodeData && (
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: '80%' }}>
                <Text style={styles.qrCodeModalText}>
                  Scan this QR code with your device to install the eSIM.
                </Text>
                {orderReference && (
                  <Text style={styles.qrCodeModalSubText}>
                    Order Reference: {orderReference}
                  </Text>
                )}

                {qrCodeData.qrCode ? (
                  <View style={styles.qrCodeContainer}>
                    {/* Check if qrCode is a ZIP file (starts with "PK") */}
                    {qrCodeData.qrCodeType === 'zip' || (typeof qrCodeData.qrCode === 'string' && qrCodeData.qrCode.startsWith('PK')) ? (
                      <View style={styles.qrCodePlaceholder}>
                        <Icon name="qr-code-outline" size={100} color="#CC0000" />
                        <Text style={styles.qrCodeStringText}>
                          QR Code ZIP file received
                        </Text>
                        <Text style={styles.qrCodeInfoText}>
                          The QR code is packaged in a ZIP file. For installation, please use the matching ID below or extract the ZIP file.
                        </Text>
                        {qrCodeData.matchingId && (
                          <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Matching ID:</Text>
                            <Text style={styles.infoValue}>{qrCodeData.matchingId}</Text>
                          </View>
                        )}
                      </View>
                    ) : qrCodeData.qrCode.startsWith('data:image') || qrCodeData.qrCode.startsWith('http') ? (
                      <Image
                        source={{ uri: qrCodeData.qrCode }}
                        style={styles.qrCodeImage}
                        resizeMode="contain"
                        onError={(e) => console.error('QR Code Image Error:', e.nativeEvent.error)}
                      />
                    ) : (
                      // If it's a raw string (LPA string), display it
                      <View style={styles.qrCodePlaceholder}>
                        <Icon name="qr-code-outline" size={100} color="#CC0000" />
                        <Text style={styles.qrCodeStringText}>{qrCodeData.qrCode}</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.qrCodePlaceholder}>
                    <Icon name="alert-circle-outline" size={60} color="#CC0000" />
                    <Text style={styles.qrCodeStringText}>QR Code not available.</Text>
                  </View>
                )}

                {qrCodeData.matchingId && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Matching ID:</Text>
                    <Text style={styles.infoValue}>{qrCodeData.matchingId}</Text>
                  </View>
                )}
                {iccid && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>ICCID:</Text>
                    <Text style={styles.infoValue}>{iccid}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={copyQRCodeToClipboard}
                >
                  <Icon name="copy-outline" size={20} color="#fff" />
                  <Text style={styles.copyButtonText}>Copy QR Code Data</Text>
                </TouchableOpacity>

                <Text style={styles.installationInstructionsTitle}>Installation Instructions:</Text>
                <Text style={styles.installationInstructionsText}>
                  1. Ensure your device is connected to Wi-Fi.{'\n'}
                  2. Go to Settings → Cellular/Mobile Data → Add Cellular Plan.{'\n'}
                  3. Scan the QR code above or use the Matching ID.{'\n'}
                  4. Follow the on-screen prompts to complete the installation.{'\n'}
                  5. If scanning doesn't work, you can manually enter the SMDP+ Address and Activation Code (Matching ID).
                </Text>

                <TouchableOpacity
                  style={styles.modalContinueButton}
                  onPress={() => {
                    setQrCodeModalVisible(false);
                    navigation.navigate('ESIMInstallScreen', {
                      reference: orderReference,
                      orderReference: orderReference,
                      matchingId: qrCodeData.matchingId || matchingId,
                      iccid: iccid,
                      qrCode: qrCodeData.qrCode,
                      qrCodeData: qrCodeData
                    });
                  }}
                >
                  <Text style={styles.modalContinueButtonText}>Go to Installation Screen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalContinueButton, { backgroundColor: '#E0E0E0', marginTop: 10 }]}
                  onPress={() => setQrCodeModalVisible(false)}
                >
                  <Text style={[styles.modalContinueButtonText, { color: '#333' }]}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 80,
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    elevation: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
    elevation: 101,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
    elevation: 101,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 101,
    elevation: 101,
  },
  headerSpacer: {
    width: 40,
  },
  fixedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: -80,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
    fontFamily: 'Poppins',
  },
  cardText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  flagIcon: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#000000',
    marginRight: 8,
    fontFamily: 'Poppins',
  },
  oldPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginRight: 8,
    fontFamily: 'Poppins',
  },
  newPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  linkText: {
    color: '#999999',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  addPromoButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  addPromoButtonText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  bonusPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 8,
    fontFamily: 'Poppins',
  },
  redeemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  redeemButtonText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Poppins',
  },
  redeemPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
    fontFamily: 'Poppins',
  },
  redeemedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 12,
    fontFamily: 'Poppins',
  },
  paymentButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E53935',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Poppins',
  },
  highlightText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  legalText: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: 'Poppins',
  },
  completeButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'Poppins',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Poppins',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  paymentOptionSelected: {
    borderColor: '#E53935',
    backgroundColor: '#FFF5F5',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardIcon: {
    backgroundColor: '#E8F5E9',
  },
  creditCardImage: {
    width: 32,
    height: 32,
  },
  paypalIcon: {
    backgroundColor: '#E3F2FD',
  },
  paypalImage: {
    width: 32,
    height: 32,
  },
  bankIcon: {
    backgroundColor: '#FFF3E0',
  },
  bankTransferImage: {
    width: 32,
    height: 32,
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Poppins',
  },
  modalContinueButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalContinueButtonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  modalContinueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 20,
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  inputWrapperHalf: {
    flex: 1,
    marginRight: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily: 'Poppins',
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  countryText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Poppins',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  countryPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  countryPickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  countryPickerSheet: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  countryPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  countryPickerCancel: {
    fontSize: 16,
    color: '#999999',
    fontFamily: 'Poppins',
  },
  countryPickerDone: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  countryPickerList: {
    backgroundColor: '#FFFFFF',
    maxHeight: 400,
  },
  countryPickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  countryPickerItemSelected: {
    backgroundColor: '#F5F5F5',
  },
  countryPickerFlag: {
    width: 32,
    height: 24,
    borderRadius: 4,
    marginRight: 12,
  },
  countryPickerItemText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Poppins',
  },
  qrCodeModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  qrCodeScrollView: {
    maxHeight: 600,
  },
  qrCodeInfoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  qrCodeSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  qrCodeInfoText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins',
  },
  qrCodeDisplaySection: {
    padding: 20,
    alignItems: 'center',
  },
  qrCodeImage: {
    width: 250,
    height: 250,
    marginVertical: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  qrCodeStringContainer: {
    width: '100%',
    alignItems: 'center',
  },
  qrCodeIconContainer: {
    marginVertical: 20,
  },
  qrCodeStringLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  qrCodeDataContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  qrCodeDataText: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CC0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  qrCodeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    width: '100%',
    marginTop: 8,
  },
  qrCodeInfoLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins',
  },
  qrCodeInfoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  qrCodeErrorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  qrCodeErrorText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  installationInstructions: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    fontFamily: 'Poppins',
  },
  qrCodeActionButtons: {
    padding: 20,
    paddingTop: 10,
  },
  installButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  closeQRButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeQRButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  qrCodeModalText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
    fontFamily: 'Poppins',
  },
  qrCodeModalSubText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: 'Poppins',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 20,
  },
  qrCodePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    width: '100%',
  },
  qrCodeStringText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'monospace',
    paddingHorizontal: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    width: '100%',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Poppins',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
    fontFamily: 'Poppins',
    flex: 1,
    textAlign: 'right',
  },
  installationInstructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 20,
    fontFamily: 'Poppins',
  },
  installationInstructionsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
});

