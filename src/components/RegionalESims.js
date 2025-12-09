import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView } from 'react-native';
import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getSafeWindowDimensions, scaleSize } from '../utils/dimensions';

// Base design dimensions (iPhone standard)
const BASE_WIDTH = 375;

// Helper function to get country code from country name
const getCountryCode = (countryName) => {
  const countryCodeMap = {
    'Albania': 'al', 'Austria': 'at', 'Belgium': 'be', 'Bulgaria': 'bg', 'Canada': 'ca', 'Croatia': 'hr',
    'Czech Republic': 'cz', 'Denmark': 'dk', 'Estonia': 'ee', 'Finland': 'fi', 'France': 'fr', 'Germany': 'de',
    'Greece': 'gr', 'Hungary': 'hu', 'Iceland': 'is', 'Ireland': 'ie', 'Italy': 'it', 'Latvia': 'lv',
    'Lithuania': 'lt', 'Luxembourg': 'lu', 'Netherlands': 'nl', 'Norway': 'no', 'Poland': 'pl', 'Portugal': 'pt',
    'Romania': 'ro', 'Slovakia': 'sk', 'Slovenia': 'si', 'Spain': 'es', 'Sweden': 'se', 'Switzerland': 'ch',
    'United Kingdom': 'gb', 'Ukraine': 'ua', 'Russia': 'ru', 'Australia': 'au', 'China': 'cn', 'Hong Kong': 'hk', 
    'India': 'in', 'Indonesia': 'id', 'Japan': 'jp', 'Malaysia': 'my', 'New Zealand': 'nz', 'Philippines': 'ph', 
    'Singapore': 'sg', 'South Korea': 'kr', 'Thailand': 'th', 'Vietnam': 'vn', 'Taiwan': 'tw', 
    'United States': 'us', 'Mexico': 'mx', 'Brazil': 'br', 'Argentina': 'ar', 'Chile': 'cl', 
    'United Arab Emirates': 'ae', 'Saudi Arabia': 'sa', 'Israel': 'il', 'Jordan': 'jo', 'Qatar': 'qa',
    'Turkey': 'tr', 'Egypt': 'eg', 'South Africa': 'za', 'Kenya': 'ke', 'Morocco': 'ma', 'Tunisia': 'tn', 
    'Ghana': 'gh', 'Nigeria': 'ng', 'Algeria': 'dz', 'Ethiopia': 'et'
  };
  return countryCodeMap[countryName] || countryName.toLowerCase().substring(0, 2);
};

export default function RegionalESimsScreen({ navigation, route }) {
  const [dimensions, setDimensions] = useState(() => getSafeWindowDimensions());

  useEffect(() => {
    setDimensions(getSafeWindowDimensions());
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      if (window && typeof window.width === 'number' && typeof window.height === 'number') {
        setDimensions({
          width: window.width,
          height: window.height
        });
      }
    });

    return () => subscription?.remove();
  }, []);

  const SCREEN_HEIGHT = dimensions?.height || 667;
  const HEADER_HEIGHT = SCREEN_HEIGHT * 0.38; // 38% of screen height

  // Regional eSIM packages with data plans
  const regionalPackages = [
    {
      id: 1,
      planName: 'AfriConnect',
      icon: '🌍',
      price: '6.5',
      data: '1 GB',
      validity: '7 days',
      countries: [
        { name: 'Democratic Republic of Congo', flag: 'cd' },
        { name: 'Ghana', flag: 'gh' },
        { name: 'Mozambique', flag: 'mz' },
        { name: 'South Africa', flag: 'za' },
        { name: 'Kenya', flag: 'ke' },
        { name: 'Nigeria', flag: 'ng' },
        { name: 'Morocco', flag: 'ma' },
        { name: 'Tunisia', flag: 'tn' },
      ]
    },
    {
      id: 2,
      planName: 'Caribbean',
      icon: '🏝️',
      price: '7.99',
      data: '1 GB',
      validity: '7 days',
      countries: [
        { name: 'Antigua and Barbuda', flag: 'ag' },
        { name: 'Aruba', flag: 'aw' },
        { name: 'Barbados', flag: 'bb' },
        { name: 'Bonaire', flag: 'bq' },
        { name: 'British Virgin Islands', flag: 'vg' },
        { name: 'Cayman Islands', flag: 'ky' },
        { name: 'Cuba', flag: 'cu' },
        { name: 'Dominica', flag: 'dm' },
        { name: 'Dominican Republic', flag: 'do' },
        { name: 'Grenada', flag: 'gd' },
        { name: 'Haiti', flag: 'ht' },
        { name: 'Jamaica', flag: 'jm' },
        { name: 'Puerto Rico', flag: 'pr' },
        { name: 'Trinidad and Tobago', flag: 'tt' },
        { name: 'Turks and Caicos', flag: 'tc' },
        { name: 'Saint Kitts and Nevis', flag: 'kn' },
        { name: 'Saint Lucia', flag: 'lc' },
        { name: 'Saint Vincent', flag: 'vc' },
        { name: 'US Virgin Islands', flag: 'vi' },
        { name: 'Bahamas', flag: 'bs' },
      ]
    },
    {
      id: 3,
      planName: 'Europe Connect',
      icon: '🌍',
      price: '8.5',
      data: '1 GB',
      validity: '7 days',
      countries: [
        { name: 'France', flag: 'fr' },
        { name: 'Germany', flag: 'de' },
        { name: 'Italy', flag: 'it' },
        { name: 'Spain', flag: 'es' },
        { name: 'United Kingdom', flag: 'gb' },
        { name: 'Netherlands', flag: 'nl' },
        { name: 'Belgium', flag: 'be' },
        { name: 'Austria', flag: 'at' },
        { name: 'Switzerland', flag: 'ch' },
        { name: 'Portugal', flag: 'pt' },
      ]
    },
    {
      id: 4,
      planName: 'Asia Pacific',
      icon: '🌏',
      price: '9.5',
      data: '1 GB',
      validity: '7 days',
      countries: [
        { name: 'Japan', flag: 'jp' },
        { name: 'South Korea', flag: 'kr' },
        { name: 'China', flag: 'cn' },
        { name: 'Singapore', flag: 'sg' },
        { name: 'Thailand', flag: 'th' },
        { name: 'Malaysia', flag: 'my' },
        { name: 'Indonesia', flag: 'id' },
        { name: 'Philippines', flag: 'ph' },
        { name: 'Australia', flag: 'au' },
        { name: 'New Zealand', flag: 'nz' },
      ]
    },
    {
      id: 5,
      planName: 'Middle East',
      icon: '🕌',
      price: '7.5',
      data: '1 GB',
      validity: '7 days',
      countries: [
        { name: 'United Arab Emirates', flag: 'ae' },
        { name: 'Saudi Arabia', flag: 'sa' },
        { name: 'Israel', flag: 'il' },
        { name: 'Jordan', flag: 'jo' },
        { name: 'Qatar', flag: 'qa' },
        { name: 'Turkey', flag: 'tr' },
        { name: 'Egypt', flag: 'eg' },
      ]
    },
    {
      id: 6,
      planName: 'The World is Yours',
      icon: '🌎',
      price: '10.5',
      data: '1 GB',
      validity: '7 days',
      countries: [
        { name: 'United States', flag: 'us' },
        { name: 'United Kingdom', flag: 'gb' },
        { name: 'France', flag: 'fr' },
        { name: 'Germany', flag: 'de' },
        { name: 'Japan', flag: 'jp' },
        { name: 'Australia', flag: 'au' },
        { name: 'Canada', flag: 'ca' },
        { name: 'Singapore', flag: 'sg' },
        { name: 'United Arab Emirates', flag: 'ae' },
        { name: 'Brazil', flag: 'br' },
      ]
    },
  ];

  const renderPackageCard = (pkg) => {
    const displayedCountries = pkg.countries.slice(0, 5);
    const remainingCount = pkg.countries.length - displayedCountries.length;
    
    return (
      <View key={pkg.id} style={styles.packageCard}>
        <View style={styles.packageHeader}>
          <View style={styles.packageTitleContainer}>
            <Text style={styles.packageIcon}>{pkg.icon}</Text>
            <Text style={styles.packageName}>{pkg.planName}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${pkg.price}</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </View>
        </View>
        
        <View style={styles.dataRow}>
          <View style={styles.dataInfo}>
            <Ionicons name="globe-outline" size={18} color="#666" />
            <Text style={styles.dataLabel}>Data</Text>
          </View>
          <Text style={styles.dataValue}>{pkg.data}</Text>
        </View>
        
        <Text style={styles.validity}>Validity {pkg.validity}</Text>
        
        <Text style={styles.supportedCountriesLabel}>Supported Countries</Text>
        <View style={styles.flagsContainer}>
          {displayedCountries.map((country, index) => (
            <Image
              key={index}
              source={{ uri: `https://flagcdn.com/w40/${country.flag}.png` }}
              style={styles.countryFlag}
            />
          ))}
          {remainingCount > 0 && (
            <View style={styles.moreFlags}>
              <Text style={styles.moreFlagsText}>+{remainingCount}</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.buyNowButton}
          onPress={() => {
            // Navigate to package details or checkout
            navigation.navigate('DataPlanScreen', {
              countryName: pkg.planName,
              countryFlag: pkg.countries[0]?.flag || 'us',
              isRegional: true,
              packageData: pkg
            });
          }}
        >
          <Text style={styles.buyNowText}>Buy now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!navigation) {
    return (
      <View style={styles.container}>
        <Text>Navigation not available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { height: HEADER_HEIGHT }]}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Regional eSIMs</Text>
          </View>
          <TouchableOpacity 
            style={[styles.searchButton, { width: scaleSize(40), height: scaleSize(40), borderRadius: scaleSize(40) / 2 }]}
            onPress={() => navigation.navigate('CountrySelectScreen')}
          >
            <Ionicons name="search-outline" size={scaleSize(20)} color="#CC0000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {regionalPackages.map((pkg) => renderPackageCard(pkg))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 80,
    zIndex: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  backButton: {
    padding: 4,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  searchButton: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
  },
  packageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  packageIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
    fontFamily: 'Poppins',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins',
  },
  validity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  supportedCountriesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  flagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  countryFlag: {
    width: 32,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  moreFlags: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  moreFlagsText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  buyNowButton: {
    backgroundColor: '#CC0000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});
