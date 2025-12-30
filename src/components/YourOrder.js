import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TextInput, Dimensions, Alert, ActivityIndicator, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';
import { 
  createESIMOrder,
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

  // Handle complete purchase - using eSIM Go API v2.4 directly
  const handleCompletePurchase = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Extract bundle information from order details
      // Priority: Use bundleName from route params (actual bundle ID from API)
      let bundleId = orderDetails.bundleName || orderDetails.bundleId;
      
      // If no bundle ID, try to construct it (fallback)
      if (!bundleId) {
        // Construct bundle ID from order details
        // Format: esim_{data}_{days}_{country}_{version}
        // Example: esim_1GB_7D_GB_V2
        const dataAmount = orderDetails.data.replace(' GB', '').replace(' GB', '').trim();
        const days = orderDetails.days.replace(' Days', '').replace(' Day', '').trim();
        const countryCode = orderDetails.flag.toUpperCase();
        
        // Handle decimal data amounts (e.g., "1.5 GB" -> "1.5GB" or "1.5")
        const dataFormatted = dataAmount.includes('.') ? dataAmount.replace('.', '') : dataAmount;
        bundleId = `esim_${dataFormatted}GB_${days}D_${countryCode}_V2`;
        
        console.warn('No bundle ID provided, constructed:', bundleId);
      }

      // Validate bundle ID format
      if (!bundleId || typeof bundleId !== 'string') {
        throw new Error('Invalid bundle ID. Please select a plan and try again.');
      }

      // Step 2: Verify bundle exists (optional but helpful)
      try {
        console.log('Verifying bundle exists:', bundleId);
        await fetchPlanDetails(bundleId);
        console.log('Bundle verified successfully');
      } catch (verifyError) {
        console.warn('Bundle verification failed:', verifyError.message);
        // Continue anyway - the activate endpoint will validate it
      }
      
      // Step 3: Create Order using eSIM Go API v2.4
      // POST https://api.esim-go.com/v2.4/orders
      console.log('Creating eSIM order with eSIM Go API:');
      console.log('Bundle ID:', bundleId);
      console.log('Bundle ID type:', typeof bundleId);
      console.log('Bundle ID length:', bundleId ? bundleId.length : 0);
      
      // Ensure bundleId is a valid string
      if (!bundleId || typeof bundleId !== 'string' || bundleId.trim().length === 0) {
        throw new Error('Invalid bundle ID. Bundle name is required and must be a non-empty string.');
      }
      
      const orderResponse = await createESIMOrder({
        bundleName: bundleId.trim(), // Trim whitespace
        quantity: 1,
        assign: true, // Assign to new eSIM
        type: 'transaction', // Use 'validate' to test without charging
      });

      console.log('Order created successfully:', orderResponse);

      // Extract order reference from response
      // eSIM Go API returns orderReference in the response
      let orderReference = null;
      
      if (typeof orderResponse === 'string') {
        // If response is a JSON string, parse it
        try {
          const parsed = JSON.parse(orderResponse);
          orderReference = parsed.orderReference || parsed.reference || parsed.data?.orderReference;
        } catch (e) {
          // Not JSON, try to extract from string
          const match = orderResponse.match(/orderReference["\s:]+([^"}\s]+)/i);
          if (match) orderReference = match[1];
        }
      } else if (typeof orderResponse === 'object') {
        orderReference = orderResponse.orderReference || 
                        orderResponse.reference || 
                        orderResponse.data?.orderReference ||
                        orderResponse.data?.reference;
      }

      if (!orderReference) {
        console.error('Order response:', orderResponse);
        throw new Error('Order created but no order reference received. Response: ' + JSON.stringify(orderResponse));
      }

      console.log('Order reference:', orderReference);

      // Step 4: Get Order Details using eSIM Go API v2.4
      // GET https://api.esim-go.com/v2.4/orders/{orderReference}
      console.log('Fetching order details from eSIM Go API...');
      let orderDetailsResult = null;
      try {
        orderDetailsResult = await getOrderDetails(orderReference);
        console.log('Order details:', orderDetailsResult);
      } catch (orderError) {
        console.warn('Could not fetch order details from eSIM Go API:', orderError.message);
        // Continue anyway - we can still get install details
      }

      // Step 5: Get eSIM Install Details using eSIM Go API v2.4
      // GET https://api.esim-go.com/v2.4/esims/assignments?reference={orderReference}
      console.log('Fetching eSIM install details for order reference:', orderReference);
      
      // Wait a moment for eSIM to be ready (sometimes takes a few seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let installDetails = null;
      let installURL = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      // Retry getting install details (might not be ready immediately)
      while (retryCount < maxRetries && !installDetails) {
        try {
          installDetails = await getESIMInstallDetails(orderReference, { format: 'json' });
          console.log('eSIM install details retrieved successfully');
          
          // Try to get install URL
          try {
            installURL = await getESIMInstallURL(orderReference);
            console.log('Install URL retrieved:', installURL);
          } catch (urlError) {
            console.warn('Could not get install URL, but have install details');
          }
          
          break; // Success, exit retry loop
        } catch (installError) {
          retryCount++;
          console.warn(`Install details fetch attempt ${retryCount} failed:`, installError.message);
          
          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
          }
        }
      }

      // Step 6: Handle Installation
      if (installDetails || installURL) {
        // Show success with installation options
        Alert.alert(
          'Purchase Successful!',
          `Your eSIM order has been created and the bundle has been purchased!\n\nOrder Reference: ${orderReference}\n\nWould you like to install the eSIM now?`,
          [
            {
              text: 'Install Now',
              onPress: async () => {
                if (installURL) {
                  try {
                    // Try to open install URL directly
                    const canOpen = await Linking.canOpenURL(installURL);
                    if (canOpen) {
                      await Linking.openURL(installURL);
                      Alert.alert(
                        'Installation Started',
                        'Follow the on-screen instructions to complete the eSIM installation.',
                        [{ text: 'OK' }]
                      );
                    } else {
                      // Navigate to installation screen
                      navigation.navigate('ESIMInstallScreen', {
                        reference: orderReference,
                        orderReference: orderReference,
                        installDetails: installDetails,
                        installURL: installURL
                      });
                    }
                  } catch (linkError) {
                    console.error('Error opening install URL:', linkError);
                    navigation.navigate('ESIMInstallScreen', {
                      reference: orderReference,
                      orderReference: orderReference,
                      installDetails: installDetails,
                      installURL: installURL
                    });
                  }
                } else {
                  // Navigate to installation screen
                  navigation.navigate('ESIMInstallScreen', {
                    reference: orderReference,
                    orderReference: orderReference,
                    installDetails: installDetails
                  });
                }
              },
            },
            {
              text: 'View Details',
              onPress: () => {
                // Navigate to installation screen
                navigation.navigate('ESIMInstallScreen', {
                  reference: orderReference,
                  orderReference: orderReference,
                  installDetails: installDetails,
                  installURL: installURL
                });
              },
            },
            {
              text: 'Later',
              style: 'cancel',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        // Install details not available yet
        Alert.alert(
          'Order Created Successfully!',
          `Your eSIM order has been created and the bundle has been purchased!\n\nOrder Reference: ${orderReference}\n\nThe eSIM installation details will be available shortly. You can check back in a few moments.`,
          [
            {
              text: 'Check Installation',
              onPress: () => {
                // Navigate to installation screen which will retry fetching install details
                navigation.navigate('ESIMInstallScreen', {
                  reference: orderReference,
                  orderReference: orderReference
                });
              },
            },
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]
        );
      }

    } catch (error) {
      console.error('Error completing purchase:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to complete purchase. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
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
          style={[styles.completeButton, isProcessing && styles.completeButtonDisabled]}
          onPress={handleCompletePurchase}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
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
});

