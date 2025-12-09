import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

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
  const [confirmChecked, setConfirmChecked] = useState(true);
  const [pointsRedeemed, setPointsRedeemed] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Germany');
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  
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
        {/* TikTel Points Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>TikTel Points</Text>
          <Text style={styles.cardText}>Bonus points for buying a 10GB or higher plan</Text>
          <Text style={styles.bonusPoints}>200!</Text>
          <Text style={styles.cardText}>Redeem now or add to your points pool for later</Text>
          {!pointsRedeemed ? (
            <TouchableOpacity 
              style={styles.redeemButton}
              onPress={() => setPointsRedeemed(true)}
            >
              <Text style={styles.redeemButtonText}>Redeem Bonus Now : </Text>
              <Text style={styles.redeemPoints}>200pts</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.redeemedText}>Points redeemed!</Text>
          )}
        </View>

        {/* Add Payment Method Button */}
        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={() => setPaymentModalVisible(true)}
        >
          <Text style={styles.paymentButtonText}>Add Payment Method</Text>
        </TouchableOpacity>

        {/* Confirmation Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setConfirmChecked(!confirmChecked)}
          >
            {confirmChecked && <Icon name="checkmark" size={16} color="#E53935" />}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>
            I confirm that I have an unlocked and{' '}
            <Text style={styles.highlightText}>eSIM</Text> compatible device
          </Text>
        </View>

        {/* Legal Text */}
        <Text style={styles.legalText}>
          By Pressing "Complete Purchase" you agree to the{' '}
          <Text style={styles.linkText}>Refund Policy</Text> and{' '}
          <Text style={styles.linkText}>Terms & Conditions</Text>
        </Text>

        {/* Complete Purchase Button */}
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Complete Purchase</Text>
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
    justifyContent: 'space-between',
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
    width: 24,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    width: 24,
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

