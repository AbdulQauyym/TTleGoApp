import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Path } from 'react-native-svg';
import { getSafeWindowDimensions, scaleSize } from '../utils/dimensions';

// Import region icons
const AfricaIcon = require('../assets/Africa.png');
const AsiaIcon = require('../assets/Asia.png');
const EuropeIcon = require('../assets/Europe.png');
const MiddleEastIcon = require('../assets/middle-east.png');
const NorthAmericaIcon = require('../assets/north-america.png');
const SouthAmericaIcon = require('../assets/south-america.png');

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

  // State for regional packages
  const [regionalPackages, setRegionalPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get region from route params
  const selectedRegion = route?.params?.region;

  // Helper function to normalize region name (case-insensitive)
  const normalizeRegionName = (region) => {
    if (!region) return 'Other';
    return region.trim();
  };

  // Region color mapping (case-insensitive matching)
  const getRegionColor = (region) => {
    const normalized = normalizeRegionName(region).toLowerCase();
    const colorMap = {
      'africa': '#CC0000', // Red color for Africa
      'asia': '#1976D2',
      'europe': '#03A9F4',
      'north america': '#4CAF50',
      'south america': '#F44336',
      'middle east': '#8BC34A',
      'oceania': '#9C27B0',
    };
    return colorMap[normalized] || '#CC0000';
  };

  // Region icon mapping (case-insensitive matching)
  const getRegionIcon = (region) => {
    const normalized = normalizeRegionName(region).toLowerCase();
    const iconMap = {
      'africa': 'globe', // Globe icon for Africa in red
      'asia': 'map-outline',
      'europe': 'map-outline',
      'north america': 'map-outline',
      'south america': 'map-outline',
      'middle east': 'map-outline',
      'oceania': 'map-outline',
    };
    return iconMap[normalized] || 'map-outline';
  };

  // Load regional packages from API
  const loadRegionalPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching regional packages from API...');
      
      // Fetch raw data directly from API
      const BASE_URL = 'https://www.ttelgo.com/api';
      const response = await fetch(`${BASE_URL}/plans/bundles/regional`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();
      console.log('Regional packages API response:', apiData);
      
      if (apiData && Array.isArray(apiData.bundles) && apiData.bundles.length > 0) {
        // Group bundles by region
        const regionMap = {};
        
        apiData.bundles.forEach(bundle => {
          if (bundle.countries && Array.isArray(bundle.countries)) {
            bundle.countries.forEach(country => {
              const region = country.region || 'Other';
              
              if (!regionMap[region]) {
                const icon = getRegionIcon(region);
                const iconColor = getRegionColor(region);
                console.log(`Region: ${region}, Icon: ${icon}, Color: ${iconColor}`);
                
                regionMap[region] = {
                  id: region,
                  planName: region,
                  icon: icon,
                  iconColor: iconColor,
                  price: null,
                  data: null,
                  validity: null,
                  countries: [],
                  bundles: [],
                };
              }
              
              // Add country if not already in list
              const countryExists = regionMap[region].countries.some(
                c => c.name === country.name
              );
              
              if (!countryExists) {
                regionMap[region].countries.push({
                  name: country.name,
                  flag: country.iso?.toLowerCase() || getCountryCode(country.name),
                  iso: country.iso,
                });
              }
              
              // Store bundle reference
              if (!regionMap[region].bundles.some(b => b.name === bundle.name)) {
                regionMap[region].bundles.push(bundle);
              }
              
              // Set price (use first bundle's price as reference)
              if (!regionMap[region].price && bundle.price) {
                regionMap[region].price = bundle.price.toFixed(2);
              }
              
              // Set data and validity from first bundle
              if (!regionMap[region].data) {
                if (bundle.unlimited || bundle.dataAmount === -1) {
                  regionMap[region].data = 'Unlimited';
                } else if (bundle.dataAmount) {
                  const dataInGB = bundle.dataAmount / 1000;
                  regionMap[region].data = dataInGB % 1 === 0 
                    ? `${dataInGB} GB` 
                    : `${dataInGB.toFixed(1)} GB`;
                }
              }
              
              if (!regionMap[region].validity && bundle.duration) {
                regionMap[region].validity = `${bundle.duration} ${bundle.duration === 1 ? 'Day' : 'Days'}`;
              }
            });
          }
        });
        
        // Convert map to array and filter by selected region if provided
        let packages = Object.values(regionMap);
        
        if (selectedRegion) {
          packages = packages.filter(pkg => pkg.planName === selectedRegion);
        }
        
        // Sort countries within each package
        packages.forEach(pkg => {
          pkg.countries.sort((a, b) => a.name.localeCompare(b.name));
        });
        
        // Add dummy Africa region for testing (exclude from API)
        const dummyAfrica = {
          id: 'africa-dummy',
          planName: 'Africa',
          icon: 'globe',
          iconColor: '#CC0000',
          price: '9.99',
          data: '5 GB',
          validity: '30 Days',
          countries: [
            { name: 'South Africa', flag: 'za' },
            { name: 'Kenya', flag: 'ke' },
            { name: 'Nigeria', flag: 'ng' },
            { name: 'Morocco', flag: 'ma' },
            { name: 'Ghana', flag: 'gh' },
          ],
          bundles: [],
        };
        
        // Add dummy Africa at the beginning
        packages = [dummyAfrica, ...packages];
        
        setRegionalPackages(packages);
        console.log(`✅ Loaded ${packages.length} regional packages from API`);
      } else {
        console.warn('⚠️ API returned empty or invalid regional packages');
        setRegionalPackages([]);
      }
    } catch (err) {
      console.error('❌ Error loading regional packages:', err);
      setError('Failed to load regional packages. Please try again.');
      setRegionalPackages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRegion]);

  // Load packages on component mount
  useEffect(() => {
    loadRegionalPackages();
  }, [loadRegionalPackages]);

  // Get region icon image
  const getRegionIconImage = (regionName) => {
    const normalized = regionName?.toLowerCase() || '';
    const iconMap = {
      'africa': AfricaIcon,
      'asia': AsiaIcon,
      'europe': EuropeIcon,
      'north america': NorthAmericaIcon,
      'south america': SouthAmericaIcon,
      'middle east': MiddleEastIcon,
    };
    return iconMap[normalized] || null;
  };

  // Region Icon Component with Red Tint
  const RegionIconImage = ({ source, size = 24 }) => (
    <View style={styles.iconWrapper}>
      <Image 
        source={source} 
        style={[styles.regionIconImageStyle, { width: size, height: size, tintColor: '#CC0000' }]}
        resizeMode="contain"
      />
    </View>
  );

  const renderPackageCard = (pkg) => {
    const displayedCountries = pkg.countries.slice(0, 5);
    const remainingCount = pkg.countries.length - displayedCountries.length;
    
    return (
      <View key={pkg.id} style={styles.packageCard}>
        <View style={styles.packageHeader}>
          <View style={styles.packageTitleContainer}>
            {(() => {
              const iconImage = getRegionIconImage(pkg.planName);
              if (iconImage) {
                return <RegionIconImage source={iconImage} size={24} />;
              }
              return (
                <Ionicons 
                  name={pkg.icon || 'map-outline'} 
                  size={24} 
                  color={pkg.iconColor || '#CC0000'} 
                  style={styles.packageIcon}
                />
              );
            })()}
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
    marginRight: 12,
  },
  iconWrapper: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionIconImageStyle: {
    tintColor: '#CC0000',
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
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
  },
});
