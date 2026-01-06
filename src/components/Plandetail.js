import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';
import { fetchPlanDetails, fetchAllBundles } from '../services/api';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9', 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  countryCard: {
    position: 'absolute',
    top: 200,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 5,
  },
  flagCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  flag: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastDetailRow: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  detailLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailLabelContainer: {
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#CC0000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left',
    lineHeight: 18,
    marginTop: 4,
  },
  checkoutButton: {
    backgroundColor: '#CC0000',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

// Detail Row Component
function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function DataPlan({navigation, route}) {
  // Get country data from route params, default to Germany if not provided
  console.log('📥 DataPlan component - route params:', route?.params);
  const countryName = (route && route.params && route.params.countryName) ? route.params.countryName : 'Germany';
  const countryFlag = (route && route.params && route.params.countryFlag) ? route.params.countryFlag : 'de';
  const bundleName = (route && route.params && route.params.bundleName) ? route.params.bundleName : null;
  const planData = (route && route.params && route.params.planData) ? route.params.planData : null;
  
  console.log('📦 DataPlan - Received bundleName:', bundleName);
  console.log('🌍 DataPlan - countryName:', countryName, 'countryFlag:', countryFlag);
  
  // State management
  const [planDetails, setPlanDetails] = useState({
    plan: planData?.data || '20 GB',
    validity: planData?.duration || '30 Days',
    speed: '5G / LTE',
    service: 'Data Only',
    network: 'Multiple Networks',
    activation: 'Plan starts automatically when connected to network, or after 60 days',
    addOnAvailable: 'Yes',
    coverage: 'Coverage may not include overseas territories under the jurisdiction of the specified country (or countries) please contact customer support to confirm before purchasing',
    provider: 'Standard Provider'
  });
  const [loading, setLoading] = useState(false); // Loading state for plan details

  // Fetch plan details from API
  const loadPlanDetails = useCallback(async () => {
    console.log('🔄 loadPlanDetails called with bundleName:', bundleName);
    let actualBundleName = bundleName;

    // If no bundle name provided, try to find it from all bundles
    if (!actualBundleName && planData) {
      console.log('⚠️ No bundleName provided, trying to find from planData:', planData);
      try {
        setLoading(true);
        console.log('📡 Fetching all bundles to find matching bundle name...');
        
        const allBundles = await fetchAllBundles();
        
        // Try to find matching bundle based on plan data
        // Match by data amount and duration
        const matchingBundle = allBundles.find(bundle => {
          // Convert plan data to match bundle format
          const planDataGB = planData.data ? parseFloat(planData.data.replace(' GB', '').replace('Unlimited', '-1')) : null;
          const planDuration = planData.duration ? parseInt(planData.duration.replace(' Days', '').replace(' Day', '')) : null;
          
          // Check if bundle matches
          let dataMatch = false;
          if (bundle.unlimited && planData.data === 'Unlimited') {
            dataMatch = true;
          } else if (bundle.dataAmount && planDataGB) {
            const bundleGB = bundle.dataAmount / 1000;
            dataMatch = Math.abs(bundleGB - planDataGB) < 0.1; // Allow small difference
          }
          
          const durationMatch = bundle.duration === planDuration;
          
          return dataMatch && durationMatch;
        });
        
        if (matchingBundle && matchingBundle.name) {
          actualBundleName = matchingBundle.name;
          console.log('✅ Found matching bundle name:', actualBundleName);
        } else {
          console.log('⚠️ Could not find matching bundle, using plan data');
        }
      } catch (error) {
        console.error('❌ Error fetching all bundles:', error);
      }
    }

    // If we still don't have a bundle name, use plan data from route params or defaults
    if (!actualBundleName) {
      if (planData) {
        setPlanDetails(prev => ({
          ...prev,
          plan: planData.data || prev.plan,
          validity: planData.duration || prev.validity
        }));
      }
      setLoading(false);
      return;
    }

    // Fetch plan details using the bundle name
    try {
      setLoading(true);
      console.log('📡 Fetching plan details for bundle:', actualBundleName);
      console.log('🌐 API URL will be: https://ttelgo.com/api/v1/bundles/' + actualBundleName);
      
      const details = await fetchPlanDetails(actualBundleName);
      
      if (details) {
        setPlanDetails(details);
        console.log('✅ Loaded plan details from API');
      } else {
        console.log('⚠️ API returned no plan details, using defaults');
        // Keep existing defaults or plan data
        if (planData) {
          setPlanDetails(prev => ({
            ...prev,
            plan: planData.data || prev.plan,
            validity: planData.duration || prev.validity
          }));
        }
      }
    } catch (error) {
      console.error('❌ Error loading plan details:', error);
      // On error, use plan data from route params if available
      if (planData) {
        setPlanDetails(prev => ({
          ...prev,
          plan: planData.data || prev.plan,
          validity: planData.duration || prev.validity
        }));
      }
    } finally {
      setLoading(false);
    }
  }, [bundleName, planData]);

  // Fetch plan details when component mounts
  useEffect(() => {
    loadPlanDetails();
  }, [loadPlanDetails]);

  return (
    <View style={styles.container}>
      {/* Header - Fixed */}
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plan Details</Text>
          
        </View>
        
        {/* Country Information Card - Positioned on Header - Fixed */}
        <View style={styles.countryCard}>
          <View style={styles.flagCircle}>
            <Image 
              style={styles.flag}
              source={{ uri: `https://flagcdn.com/w320/${countryFlag}.png` }}
            />
          </View>
          <Text style={styles.countryName}>{countryName}</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#CC0000" />
            <Text style={styles.loadingText}>Loading plan details...</Text>
          </View>
        ) : (
          <>
            {/* Plan Details Card */}
            <View style={styles.detailsCard}>
          <DetailRow label="Plan" value={planDetails.plan} />
          <DetailRow label="Validity" value={planDetails.validity} />
          <DetailRow label="Speed" value={planDetails.speed} />
          <DetailRow label="Service" value={planDetails.service} />
          <DetailRow label="Network" value={planDetails.network} />
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Activation</Text>
              <Text style={styles.detailDescription}>{planDetails.activation}</Text>
            </View>
          </View>
          
          <DetailRow label="Add-on available" value={planDetails.addOnAvailable} />
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Coverage</Text>
              <Text style={styles.detailDescription}>{planDetails.coverage}</Text>
            </View>
          </View>
          
          <View style={[styles.detailRow, styles.lastDetailRow]}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{planDetails.provider}</Text>
          </View>
            </View>
          </>
        )}

        {/* Checkout Button */}
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => {
            try {
              navigation.navigate('YourOrderScreen', {
                country: countryName,
                flag: countryFlag,
                data: planDetails.plan,
                days: planDetails.validity,
                price: planDetails.price || planData?.newPrice || '0',
                oldPrice: planData?.oldPrice || null,
                bundleName: bundleName, // Pass the actual bundle ID/name from API
              });
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}