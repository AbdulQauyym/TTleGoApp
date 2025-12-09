import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

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
  const countryName = (route && route.params && route.params.countryName) ? route.params.countryName : 'Germany';
  const countryFlag = (route && route.params && route.params.countryFlag) ? route.params.countryFlag : 'de';
  
  // Plan details data
  const planDetails = {
    plan: '20 GB',
    validity: '30 Days',
    speed: '5G / LTE',
    service: 'Data Only',
    network: 'AT&T Verizon',
    activation: 'Plan starts automatically when connected to network, or after 60 days',
    addOnAvailable: 'Yes',
    coverage: 'Coverage may not include overseas territories under the jurisdiction of the specified country (or countries) please contact customer support to confirm before purchasing',
    provider: 'Amber'
  };

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

        {/* Checkout Button */}
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}