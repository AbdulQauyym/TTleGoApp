import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, SafeAreaView } from 'react-native';
import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

export default function GlobalESimsScreen({ navigation }) {
  // Global eSIM plans - covering all regions in one plan
  const globalPlans = [
    {
      planName: 'Global Connect',
      description: 'Stay connected worldwide with one eSIM that works in 190+ countries',
      totalCountries: 190,
      coverage: 'Worldwide',
      regions: ['Europe', 'Asia', 'Africa', 'Americas', 'Middle East', 'Oceania'],
      popularCountries: [
        'United States', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain',
        'Japan', 'Australia', 'Canada', 'Singapore', 'United Arab Emirates', 'Brazil'
      ],
      features: [
        'Works in 190+ countries',
        'No roaming charges',
        'Instant activation',
        '5G ready',
        'Multiple data plans available'
      ]
    },
    {
      planName: 'Global Premium',
      description: 'Premium global coverage with high-speed data in all major countries',
      totalCountries: 150,
      coverage: 'Major Countries Worldwide',
      regions: ['Europe', 'Asia', 'Americas', 'Middle East'],
      popularCountries: [
        'United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia',
        'Canada', 'Spain', 'Italy', 'Netherlands', 'Switzerland', 'Singapore'
      ],
      features: [
        '150+ countries covered',
        'High-speed 4G/5G',
        'Priority support',
        'Best value plans',
        'Easy top-up options'
      ]
    },
    {
      planName: 'Global Traveler',
      description: 'Perfect for frequent travelers - unlimited access to global networks',
      totalCountries: 180,
      coverage: 'Worldwide Travel',
      regions: ['All Regions'],
      popularCountries: [
        'United States', 'United Kingdom', 'France', 'Germany', 'Japan', 'Australia',
        'Canada', 'Italy', 'Spain', 'Switzerland', 'Singapore', 'United Arab Emirates'
      ],
      features: [
        '180+ countries',
        'Unlimited data options',
        'Travel-friendly pricing',
        'Multi-device support',
        '24/7 customer support'
      ]
    },
  ];

  const renderCountryTag = (countryName) => {
    const code = getCountryCode(countryName).toUpperCase();
    return (
      <View key={countryName} style={styles.countryTag}>
        <Text style={styles.countryTagText}>{code} {countryName}</Text>
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
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Global eSIMs</Text>
          </View>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => navigation.navigate('CountrySelectScreen')}
          >
            <Ionicons name="search-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Global eSIM Coverage</Text>
          <Text style={styles.infoDescription}>
            Connect seamlessly across the globe with our comprehensive global eSIM plans. 
            One eSIM, unlimited destinations.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {globalPlans.map((plan, planIndex) => {
            const displayedCountries = plan.popularCountries.slice(0, 6);
            const remainingCount = plan.totalCountries - displayedCountries.length;
            
            return (
              <View key={planIndex} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planCardTitle}>{plan.planName}</Text>
                  <View style={styles.countryBadge}>
                    <Text style={styles.countryBadgeText}>{plan.totalCountries}+ Countries</Text>
                  </View>
                </View>
                
                <Text style={styles.planDescription}>{plan.description}</Text>
                <Text style={styles.coverageText}>Coverage: {plan.coverage}</Text>
                
                <View style={styles.regionsContainer}>
                  <Text style={styles.regionsLabel}>Regions:</Text>
                  <View style={styles.regionsList}>
                    {plan.regions.map((region, idx) => (
                      <View key={idx} style={styles.regionTag}>
                        <Text style={styles.regionTagText}>{region}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.popularCountriesLabel}>Popular Countries:</Text>
                <View style={styles.countryTagsContainer}>
                  {displayedCountries.map((country) => renderCountryTag(country))}
                </View>
                
                {remainingCount > 0 && (
                  <Text style={styles.moreCountries}>+{remainingCount} more countries</Text>
                )}
                
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresLabel}>Key Features:</Text>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#CC0000" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={styles.viewPlansButton}
                  onPress={() => {
                    navigation.navigate('CountrySelectScreen', { globalPlan: plan.planName });
                  }}
                >
                  <Text style={styles.viewPlansButtonText}>View Plans →</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
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
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
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
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
  },
  infoSection: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'Poppins',
  },
  cardsContainer: {
    flexDirection: 'column',
  },
  planCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    fontFamily: 'Poppins',
  },
  countryBadge: {
    backgroundColor: '#CC0000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  planDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
    fontFamily: 'Poppins',
  },
  coverageText: {
    fontSize: 14,
    color: '#CC0000',
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  regionsContainer: {
    marginBottom: 16,
  },
  regionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  regionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  regionTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  regionTagText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  popularCountriesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    marginTop: 8,
    fontFamily: 'Poppins',
  },
  countryTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  countryTag: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  countryTagText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'Poppins',
  },
  moreCountries: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
    fontFamily: 'Poppins',
  },
  featuresContainer: {
    marginTop: 8,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  featuresLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    fontFamily: 'Poppins',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  viewPlansButton: {
    backgroundColor: '#CC0000',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  viewPlansButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});











