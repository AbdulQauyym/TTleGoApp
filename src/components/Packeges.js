import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Animated, Dimensions } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';
import { fetchCountryPlans, fetchPlanDetails } from '../services/api';

const { height: screenHeight } = Dimensions.get('window');

// Default plans fallback
const defaultPlans = [
  { id: 1, data: "20 GB", duration: "30 Days", oldPrice: "35", newPrice: "27" },
  { id: 2, data: "50 GB", duration: "30 Days", oldPrice: "48", newPrice: "27" },
  { id: 3, data: "5 GB", duration: "30 Days", oldPrice: null, newPrice: "9" },
];

export default function DataPlanScreen({ route, navigation }) {
  // Get country data from route params, default to United States if not provided
  const countryName = (route && route.params && route.params.countryName) ? route.params.countryName : 'United States';
  const countryFlag = (route && route.params && route.params.countryFlag) ? route.params.countryFlag : 'us';
  const bundleName = (route && route.params && route.params.bundleName) ? route.params.bundleName : null;
  
  console.log('📥 DataPlanScreen - route params:', route?.params);
  console.log('📦 DataPlanScreen - bundleName:', bundleName);
  
  // State management
  const [plans, setPlans] = useState(defaultPlans);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bundleDetails, setBundleDetails] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [slideAnim] = useState(new Animated.Value(0)); // For popup animation

  // Fetch bundle details by bundleName
  const loadBundleDetails = useCallback(async () => {
    if (!bundleName) {
      console.log('⚠️ No bundleName provided, skipping bundle details fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('📡 Fetching bundle details for bundleName:', bundleName);
      
      // Call API: https://ttelgo.com/api/v1/bundles/{bundleName}
      const apiUrl = `https://ttelgo.com/api/v1/bundles/${bundleName}`;
      console.log('🌐 Calling API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }
        const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📦 Bundle details API response:', JSON.stringify(data, null, 2));
      
      // Parse API response (per documentation: { success: true, data: {...} })
      let bundleData = null;
      if (data && data.success !== false && data.data !== undefined) {
        bundleData = data.data;
      } else {
        bundleData = data;
      }
      
      if (bundleData) {
        console.log('✅ Bundle details loaded successfully');
        setBundleDetails(bundleData);
      } else {
        throw new Error('Bundle details not found in response');
      }
    } catch (err) {
      console.error('❌ Error loading bundle details:', err);
      setError(err.message || 'Failed to load bundle details');
    } finally {
      setLoading(false);
    }
  }, [bundleName]);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Fetching plans for country:', countryFlag);
      
      const data = await fetchCountryPlans(countryFlag);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ Loaded ${data.length} plans from API`);
        console.log('📦 Plans data structure (first 2):', JSON.stringify(data.slice(0, 2), null, 2));
        setPlans(data);
      } else {
        console.log('⚠️ API returned empty plans, using default');
        setPlans(defaultPlans);
      }
    } catch (err) {
      console.error('❌ Error loading plans:', err);
      setError(err.message || 'Failed to load plans');
      console.log('Using default plans');
      setPlans(defaultPlans);
    } finally {
      setLoading(false);
    }
  }, [countryFlag]);

  // Fetch bundle details or plans from API when component mounts
  useEffect(() => {
    if (bundleName) {
      // If bundleName is provided, fetch bundle details
      loadBundleDetails();
    } else {
      // Otherwise, fetch plans list as before
      loadPlans();
    }
  }, [bundleName, loadBundleDetails, loadPlans]);
  
  // Toggle plan selection (radio button behavior - only one selected at a time)
  const togglePlanSelection = (planId) => {
    if (selectedPlan === planId) {
      setSelectedPlan(null);
      // Slide down popup
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setSelectedPlan(planId);
      // Slide up popup
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  // Check if a plan is selected
  const hasSelectedPlan = selectedPlan !== null;
  
  // Calculate popup translateY for animation - use useMemo to avoid recalculating
  const popupTranslateY = useMemo(() => {
    return slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 0], // Slide up from 200px below
    });
  }, [slideAnim]);
  
  return (
    <View style={styles.container}>
    <ScrollView style={styles.scrollView}>
      
      {/* Header */}
      <View style={styles.header}>
        <HeaderScreen />
        
        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          {/* Center: Flag and Country Name */}
          <View style={styles.flagContainer}>
            <View style={styles.flagCircle}>
              <Image 
                style={styles.flag}
                source={{ uri: `https://flagcdn.com/w320/${countryFlag}.png` }}
              />
            </View>
            <Text style={styles.countryName}>{countryName}</Text>
          </View>
          
          {/* Right: Shopping Bag Icon */}
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => {
              // Navigate to Cart screen
              const parent = navigation.getParent();
              if (parent) {
                // Navigate through tab navigator to Cart tab, then to CartMain
                parent.navigate('Cart', { screen: 'CartMain' });
              } else {
                // Direct navigation within the same stack
                navigation.navigate('CartMain');
              }
            }}
          >
            <Ionicons name="bag-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.chooseText}>
          {bundleName ? 'Bundle Details' : 'Choose a data plan'}
        </Text>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#CC0000" />
            <Text style={styles.loadingText}>
              {bundleName ? 'Loading bundle details...' : 'Loading plans...'}
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#CC0000" />
            <Text style={styles.errorText}>
              {bundleName ? 'Failed to load bundle details' : 'Failed to load plans'}
            </Text>
            <Text style={styles.errorSubText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                if (bundleName) {
                  loadBundleDetails();
                } else {
                  loadPlans();
                }
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : bundleName && bundleDetails ? (
          /* Bundle Details Display */
          <View style={styles.bundleDetailsContainer}>
            <View style={styles.bundleCard}>
              <Text style={styles.bundleTitle}>{bundleDetails.name || bundleName}</Text>
              
              {bundleDetails.data && (
                <View style={styles.bundleInfoRow}>
                  <Text style={styles.bundleInfoLabel}>Data:</Text>
                  <Text style={styles.bundleInfoValue}>{bundleDetails.data}</Text>
                </View>
              )}
              
              {bundleDetails.validity && (
                <View style={styles.bundleInfoRow}>
                  <Text style={styles.bundleInfoLabel}>Validity:</Text>
                  <Text style={styles.bundleInfoValue}>{bundleDetails.validity}</Text>
                </View>
              )}
              
              {bundleDetails.duration && (
                <View style={styles.bundleInfoRow}>
                  <Text style={styles.bundleInfoLabel}>Duration:</Text>
                  <Text style={styles.bundleInfoValue}>{bundleDetails.duration}</Text>
                </View>
              )}
              
              <View style={styles.bundleInfoRow}>
                <Text style={styles.bundleInfoLabel}>Price:</Text>
                <View style={styles.priceRow}>
                  {bundleDetails.oldPrice && (
                    <Text style={styles.oldPrice}>${bundleDetails.oldPrice}</Text>
                  )}
                  <Text style={styles.newPrice}>
                    ${bundleDetails.newPrice || bundleDetails.price || 'N/A'}
                  </Text>
                </View>
              </View>
              
              {bundleDetails.description && (
                <View style={styles.bundleDescriptionContainer}>
                  <Text style={styles.bundleDescriptionLabel}>Description:</Text>
                  <Text style={styles.bundleDescription}>{bundleDetails.description}</Text>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={() => {
                  navigation.navigate('YourOrderScreen', {
                    country: countryName,
                    flag: countryFlag,
                    data: bundleDetails.data || 'N/A',
                    days: bundleDetails.duration || bundleDetails.validity || 'N/A',
                    price: bundleDetails.newPrice || bundleDetails.price || '0',
                    oldPrice: bundleDetails.oldPrice,
                    bundleName: bundleName,
                  });
                }}
              >
                <Text style={styles.checkoutButtonText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No plans available for this country</Text>
          </View>
        ) : (
          /* Data Plans */
          plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planRow}>
                  <Text style={styles.dataText}>{plan.data}</Text>
                  <Text style={styles.durationText}>{plan.duration}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>USD</Text>
                    {plan.oldPrice ? (
                      <>
                        <Text style={styles.oldPrice}>{plan.oldPrice}</Text>
                        <Text style={styles.newPrice}>{plan.newPrice}</Text>
                      </>
                    ) : (
                      <Text style={styles.priceText}>{plan.newPrice}</Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={styles.checkboxContainer}
                    onPress={() => togglePlanSelection(plan.id)}
                  >
                    <View style={[styles.checkbox, isSelected ? styles.checkboxSelected : null]}>
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.planDetailsButton}
                  onPress={() => {
                    console.log('🔍 Plan Details clicked for plan:', plan);
                    console.log('📦 bundleName being passed:', plan.bundleName);
                    console.log('🌍 Navigation params:', {
                      countryName,
                      countryFlag,
                      bundleName: plan.bundleName
                    });
                    navigation.navigate('DataPlan', {
                      countryName: countryName,
                      countryFlag: countryFlag,
                      bundleName: plan.bundleName // Pass bundle name for fetching details
                    });
                  }}
                >
                  <Text style={styles.planDetailsText}>Plan Details</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}

      </View>
    </ScrollView>
    
    {/* Checkout Button Popup */}
    {hasSelectedPlan && (
      <Animated.View 
        style={[
          styles.checkoutPopup,
          {
            transform: [{ translateY: popupTranslateY }],
          }
        ]}
      >
        <View style={styles.popupContent}>
          <View style={styles.popupHeader}>
            <Text style={styles.popupTitle}>Selected Plan</Text>
            <TouchableOpacity 
              onPress={() => {
                setSelectedPlan(null);
                Animated.timing(slideAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {(() => {
            const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
            return selectedPlanData ? (
              <View style={styles.popupPlanInfo}>
                <Text style={styles.popupPlanText}>
                  {selectedPlanData.data} • {selectedPlanData.duration}
                </Text>
                <View style={styles.popupPriceRow}>
                  {selectedPlanData.oldPrice ? (
                    <>
                      <Text style={styles.popupOldPrice}>${selectedPlanData.oldPrice}</Text>
                      <Text style={styles.popupNewPrice}>${selectedPlanData.newPrice}</Text>
                    </>
                  ) : (
                    <Text style={styles.popupNewPrice}>${selectedPlanData.newPrice}</Text>
                  )}
                </View>
              </View>
            ) : null;
          })()}
          
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => {
              if (hasSelectedPlan) {
                // Get selected plan details
                const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
                
                // Navigate to YourOrder screen with order details
                navigation.navigate('YourOrderScreen', {
                  country: countryName,
                  flag: countryFlag,
                  data: selectedPlanData.data,
                  days: selectedPlanData.duration,
                  price: selectedPlanData.newPrice,
                  oldPrice: selectedPlanData.oldPrice,
                  bundleName: selectedPlanData.bundleName, // Pass the actual bundle ID/name from API
                });
              }
            }}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  flagContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 1,
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    zIndex: 2,
  },
  flagCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  countryName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
    marginTop: -50,
  },
  chooseText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flex: 1,
  },
  checkboxContainer: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CC0000",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxSelected: {
    backgroundColor: "#CC0000",
    borderColor: "#CC0000",
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  dataText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  durationText: {
    color: "#CC0000",
    fontWeight: "bold",
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 4,
  },
  oldPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  newPrice: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  planDetailsButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  planDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  checkoutPopup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  popupContent: {
    padding: 20,
    paddingBottom: 30,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  popupPlanInfo: {
    marginBottom: 16,
  },
  popupPlanText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  popupPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popupOldPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  popupNewPrice: {
    fontSize: 20,
    color: '#CC0000',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: "#CC0000",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  bottomPrice: {
    textAlign: "center",
    marginVertical: 8,
    color: "#333",
    fontWeight: "600",
    marginBottom: 10,
  },
  bundleDetailsContainer: {
    marginTop: 20,
  },
  bundleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  bundleTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  bundleInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bundleInfoLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  bundleInfoValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  bundleDescriptionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  bundleDescriptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  bundleDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CC0000',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#CC0000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
