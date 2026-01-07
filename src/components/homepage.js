import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions, Linking, ActivityIndicator, TextInput, Platform, PermissionsAndroid, Alert } from 'react-native';
import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Circle, Path } from 'react-native-svg';
import { scaleSize, scaleFont, widthPercentage, heightPercentage } from '../utils/dimensions';
import { fetchCountries, fetchRegionalPackages } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

// Import region icons
const AfricaIcon = require('../assets/Africa.png');
const AsiaIcon = require('../assets/Asia.png');
const EuropeIcon = require('../assets/Europe.png');
const MiddleEastIcon = require('../assets/middle-east.png');
const NorthAmericaIcon = require('../assets/north-america.png');
const SouthAmericaIcon = require('../assets/south-america.png');

// Safely import Voice module
let Voice = null;
let isVoiceAvailable = false;
try {
  const VoiceModule = require('@react-native-voice/voice');
  // Handle both default export and named export
  Voice = VoiceModule.default || VoiceModule;
  isVoiceAvailable = Voice && typeof Voice.start === 'function';
  if (isVoiceAvailable) {
    console.log('Voice module loaded successfully');
  }
} catch (error) {
  console.warn('Voice module not available:', error);
  isVoiceAvailable = false;
}

// Import local slider images
const slider1Image = require('../assets/slider1.jpeg');
const slider2Image = require('../assets/slider2.jpeg');
const slider3Image = require('../assets/slider3.jpeg');
const slider4Image = require('../assets/slider4.jpeg');

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function HomeScreen({navigation, route}) {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  // Get initial tab from route params, default to 'Local'
  const initialTab = route?.params?.activeTab || 'Local';
  const [activeTab, setActiveTab] = useState(initialTab); // 'Local', 'Regional', 'Global'
  
  // Update activeTab when route params change
  useEffect(() => {
    if (route?.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route?.params?.activeTab]);
  const adScrollViewRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [regionalPackagesFromAPI, setRegionalPackagesFromAPI] = useState([]);
  const [loadingRegional, setLoadingRegional] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCountries();
      
      // The API service now returns data in the correct format
      // Expected format: [{ name: string, price: string, flag: string }, ...]
      if (Array.isArray(data) && data.length > 0) {
        setCountries(data);
        setError(null); // Clear any previous errors
        console.log(`Loaded ${data.length} countries from API`);
      } else {
        // No countries from API - show empty state
        console.log('API returned empty data');
        setCountries([]);
        setError(null);
      }
    } catch (err) {
      // Show error state if API fails
      console.error('Error loading countries from API:', err.message);
      setCountries([]);
      setError(t('home.failedToLoad'));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRegionalPackages = useCallback(async () => {
    try {
      setLoadingRegional(true);
      console.log('Fetching regional packages from API...');
      const data = await fetchRegionalPackages();
      console.log('Regional packages API response:', data);
      
      // The API service now returns data in the correct format
      if (Array.isArray(data) && data.length > 0) {
        setRegionalPackagesFromAPI(data);
        console.log(`✅ Successfully loaded ${data.length} regional packages from API`);
      } else {
        console.warn('⚠️ API returned empty or invalid regional packages, using default');
        setRegionalPackagesFromAPI([]); // Clear to use default
      }
    } catch (err) {
      console.error('❌ Error loading regional packages:', err);
      console.error('Error details:', err.message, err.stack);
      setRegionalPackagesFromAPI([]); // Clear to use default
      // Keep using default regionalPackages if API fails
    } finally {
      setLoadingRegional(false);
    }
  }, []);

  // Fetch countries from API on component mount
  useEffect(() => {
    loadCountries();
    loadRegionalPackages();
  }, [loadCountries, loadRegionalPackages]);

  // Setup Voice recognition handlers
  useEffect(() => {
    if (!isVoiceAvailable || !Voice) {
      return;
    }

    try {
      Voice.onSpeechStart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };

      Voice.onSpeechEnd = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };

      Voice.onSpeechResults = (e) => {
        console.log('Speech results event:', e);
        // Handle different possible event structures
        const results = e.value || e.results || [];
        if (Array.isArray(results) && results.length > 0) {
          const recognizedText = results[0];
          if (recognizedText && typeof recognizedText === 'string') {
            setSearchQuery(recognizedText);
            setIsRecording(false);
            setIsListening(false);
            console.log('Speech recognized:', recognizedText);
            // Stop listening after getting results
            Voice.stop().catch(err => {
              console.warn('Error stopping voice after results:', err);
            });
          }
        }
      };

      Voice.onSpeechError = (e) => {
        console.error('Speech recognition error:', e);
        const errorCode = e.error?.code || e.code;
        const errorMessage = e.error?.message || e.message || 'Unknown error';
        
        setIsRecording(false);
        setIsListening(false);
        
        // Error codes: 7 = user cancelled, 9 = no match found
        // Don't show alert for user cancellations or no match
        if (errorCode !== '7' && errorCode !== '9' && errorCode !== 7 && errorCode !== 9) {
          // Check if Google Speech Recognition service is available (Android)
          if (errorCode === '6' || errorCode === 6 || errorMessage.includes('service')) {
            Alert.alert(
              t('home.error') || 'Error',
              'Speech recognition service is not available. Please install Google app or check your internet connection.'
            );
          } else {
            Alert.alert(
              t('home.error') || 'Error',
              t('home.voiceSearchError') || `Speech recognition failed: ${errorMessage}. Please try again.`
            );
          }
        } else if (errorCode === '9' || errorCode === 9) {
          // No match found - silently handle
          console.log('No speech match found');
        }
      };

      Voice.onSpeechPartialResults = (e) => {
        console.log('Speech partial results:', e);
        // Handle partial results for real-time feedback (optional)
        const results = e.value || e.results || [];
        if (Array.isArray(results) && results.length > 0) {
          const partialText = results[0];
          if (partialText && typeof partialText === 'string') {
            // Optionally update search query with partial results
            // setSearchQuery(partialText);
          }
        }
      };
    } catch (error) {
      console.error('Error setting up Voice handlers:', error);
      isVoiceAvailable = false;
    }

    return () => {
      // Cleanup
      if (isVoiceAvailable && Voice) {
        try {
          Voice.destroy().then(() => {
            Voice.removeAllListeners();
          }).catch((err) => {
            console.warn('Error cleaning up Voice:', err);
          });
        } catch (error) {
          console.warn('Error in Voice cleanup:', error);
        }
      }
    };
  }, []);

  // Safety check for navigation (after all hooks)
  if (!navigation) {
    console.error('HomeScreen: navigation prop is missing');
  }

  // Region Icon Component with Red Tint
  const RegionIcon = ({ source, size = 24 }) => (
    <View style={[styles.regionIconImageContainer, { width: size, height: size }]}>
      <Image 
        source={source} 
        style={[styles.regionIconImage, { width: size, height: size, tintColor: '#CC0000' }]}
        resizeMode="contain"
      />
    </View>
  );

  // Regions list for Regional tab with PNG icons
  const regionsList = [
    { name: 'Africa', iconColor: 'transparent', iconImage: AfricaIcon, useImageIcon: true },
    { name: 'Asia', iconColor: 'transparent', iconImage: AsiaIcon, useImageIcon: true },
    { name: 'Europe', iconColor: 'transparent', iconImage: EuropeIcon, useImageIcon: true },
    { name: 'North America', iconColor: 'transparent', iconImage: NorthAmericaIcon, useImageIcon: true },
    { name: 'South America', iconColor: 'transparent', iconImage: SouthAmericaIcon, useImageIcon: true },
    { name: 'Middle East', iconColor: 'transparent', iconImage: MiddleEastIcon, useImageIcon: true },
  ];

  // Filter countries based on search query (computed before return to avoid hook issues)
  const filteredCountries = countries.filter((item) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter regions based on search query
  const filteredRegions = regionsList.filter((region) =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // eSIM advertisement data - defined outside component to avoid recreation
  const advertisements = [
    { 
      id: 1, 
      title: 'Thailand 2025 Deal', 
      description: '50% OFF Offer - High-Speed Connectivity', 
      color: '#CC0000',
      image: slider1Image, // Local image from assets
      isLocalImage: true,
      isPromotional: true // Full image display without text overlay
    },
    { 
      id: 2, 
      title: 'Special Promotion', 
      description: 'Exclusive deals and offers', 
      color: '#CC0000',
      image: slider2Image, // Local image from assets
      isLocalImage: true,
      isPromotional: true // Full image display without text overlay
    },
    { 
      id: 3, 
      title: 'Premium Offer', 
      description: 'Best deals and connectivity', 
      color: '#CC0000',
      image: slider3Image, // Local image from assets
      isLocalImage: true,
      isPromotional: true // Full image display without text overlay
    },
    { 
      id: 4, 
      title: 'Exclusive Deal', 
      description: 'Limited time offers', 
      color: '#CC0000',
      image: slider4Image, // Local image from assets
      isLocalImage: true,
      isPromotional: true // Full image display without text overlay
    },
  ];

  // Auto-scroll advertisements
  useEffect(() => {
    const slideWidth = screenWidth - 40; // Full width minus padding
    const scrollDistance = slideWidth + 12; // slide width + marginRight
    
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % advertisements.length;
        if (adScrollViewRef.current) {
          adScrollViewRef.current.scrollTo({
            x: nextIndex * scrollDistance,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 4000); // Change slide every 4 seconds (Nomad style)

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const handleAdScroll = (event) => {
    const slideWidth = screenWidth - 40;
    const scrollDistance = slideWidth + 12;
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / scrollDistance);
    setCurrentAdIndex(index);
  };

  const openWhatsApp = () => {
    const phoneNumber = '447818984385'; // +44 7818 984385 without the +
    
    // Try WhatsApp app first (Android and iOS)
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=`;
    
    Linking.openURL(whatsappUrl).catch(() => {
      // If WhatsApp app is not installed, open web WhatsApp
      const webUrl = `https://wa.me/${phoneNumber}`;
      Linking.openURL(webUrl).catch((err) => {
        console.error('Error opening WhatsApp:', err);
      });
    });
  };

  // Request microphone permissions
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            t('home.micPermissionDenied') || 'Permission Denied',
            t('home.micPermissionMessage') || 'Microphone permission is required for voice search.'
          );
          return false;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  // Handle microphone press for voice search
  const handleMicPress = async () => {
    // Check if Voice is available
    if (!isVoiceAvailable || !Voice) {
      Alert.alert(
        t('home.voiceSearchUnavailable') || 'Voice Search Unavailable',
        t('home.voiceSearchNotSupported') || 'Voice search is not available on this device. Please rebuild the app after installing the voice module.'
      );
      return;
    }

    if (isRecording) {
      // Stop recording
      try {
        if (Voice && typeof Voice.stop === 'function') {
          await Voice.stop();
        }
        setIsRecording(false);
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping voice recognition:', error);
        setIsRecording(false);
        setIsListening(false);
      }
      return;
    }

    // Request permission first
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    // Start voice recognition
    try {
      setIsRecording(true);
      
      // Check if Voice methods are available
      if (!Voice || typeof Voice.start !== 'function') {
        throw new Error('Voice.start is not available');
      }
      
      // Check if Voice is available (Android requires Google Speech Recognition)
      if (Voice.isAvailable && typeof Voice.isAvailable === 'function') {
        try {
          const isAvailable = await Voice.isAvailable();
          if (!isAvailable) {
            throw new Error('Speech recognition service is not available on this device');
          }
        } catch (availError) {
          console.warn('Could not check voice availability:', availError);
        }
      }
      
      // Get available languages or use default
      if (Voice.getSupportedLanguages && typeof Voice.getSupportedLanguages === 'function') {
        try {
          const availableLanguages = await Voice.getSupportedLanguages();
          console.log('Available languages:', availableLanguages);
        } catch (langError) {
          console.warn('Could not get supported languages:', langError);
        }
      }
      
      // Cancel any previous recognition
      try {
        await Voice.cancel();
      } catch (cancelError) {
        // Ignore cancel errors
        console.log('No previous recognition to cancel');
      }
      
      // Start voice recognition with default language (en-US)
      // You can change this based on user's language preference
      await Voice.start('en-US');
      console.log('Voice recognition started successfully');
      
    } catch (error) {
      console.error('Error starting voice search:', error);
      setIsRecording(false);
      setIsListening(false);
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Unknown error occurred';
      
      if (errorMessage.includes('not available') || errorMessage.includes('service')) {
        Alert.alert(
          t('home.error') || 'Error',
          'Speech recognition service is not available. Please install Google app (Android) or check your device settings.'
        );
      } else {
        Alert.alert(
          t('home.error') || 'Error',
          t('home.voiceSearchError') || `Failed to start voice search: ${errorMessage}. Please try again.`
        );
      }
    }
  };

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
              onError={() => {
                // Silently handle flag image errors
              }}
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
            try {
              navigation?.navigate('DataPlanScreen', {
                countryName: pkg.planName,
                countryFlag: pkg.countries[0]?.flag || 'us',
                isRegional: true,
                packageData: pkg
              });
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}
        >
          <Text style={styles.buyNowText}>Buy now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.profileImageContainer}>
            <Ionicons name="person-circle" size={60} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.headerTitle}>Guest</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => {
              try {
                navigation?.navigate('NotificationScreen');
              } catch (error) {
                console.error('Navigation error:', error);
              }
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.bannerContainer}>
          <HeaderScreen/>
        </View>
      </View>
 
      {/* eSIM Usage */}
      <View style={styles.usageCard}>
        {/* Advertisement Slider */}
        <ScrollView
          ref={adScrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleAdScroll}
          style={styles.adScrollView}
          contentContainerStyle={styles.adScrollContent}
        >
          {advertisements.map((ad, index) => {
            // Check if image is local (require) or remote (URI string)
            const isLocal = ad.isLocalImage || (ad.image && typeof ad.image !== 'string');
            const imageSource = isLocal ? ad.image : { uri: ad.image };
            
            return (
              <View key={ad.id} style={[styles.adSlide, { backgroundColor: ad.color }]}>
                {ad.image ? (
                  <Image 
                    source={imageSource}
                    style={ad.isPromotional ? styles.adPromoImage : styles.adImage}
                    resizeMode={ad.isPromotional ? "contain" : "cover"}
                    onError={(error) => {
                      // Silently handle image errors
                    }}
                  />
                ) : null}
                {!ad.isPromotional && (
                  <View style={styles.adTextContainer}>
                    <Text style={styles.adTitle}>{ad.title}</Text>
                    <Text style={styles.adDescription}>{ad.description}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
        
        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {advertisements.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentAdIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Popular Countries */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{t('home.dataPlans')}</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={handleMicPress}
          style={styles.micButton}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isRecording ? "mic" : "mic-outline"} 
            size={20} 
            color={isRecording ? "#CC0000" : "#999"} 
          />
          {isListening && (
            <View style={styles.recordingIndicator} />
          )}
        </TouchableOpacity>
      </View>
     
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[activeTab === 'Local' ? styles.tabActive : styles.tab, styles.tabSpacing]}
          onPress={() => setActiveTab('Local')}
        >
          <Text style={activeTab === 'Local' ? styles.tabTextActive : styles.tabText}>{t('home.localESims')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[activeTab === 'Regional' ? styles.tabActive : styles.tab, styles.tabSpacing]}
          onPress={() => {
            setActiveTab('Regional');
            // Refresh regional packages when tab is clicked
            if (regionalPackagesFromAPI.length === 0) {
              loadRegionalPackages();
            }
          }}
        >
          <Text style={activeTab === 'Regional' ? styles.tabTextActive : styles.tabText}>{t('home.regionalESims')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={activeTab === 'Global' ? styles.tabActive : styles.tab}
          onPress={() => setActiveTab('Global')}
        >
          <Text style={activeTab === 'Global' ? styles.tabTextActive : styles.tabText}>{t('home.globalESims')}</Text>
        </TouchableOpacity>
      </View>
      {/* Content based on active tab */}
      {activeTab === 'Local' && (
        <ScrollView 
          style={styles.countryListContainer}
          contentContainerStyle={styles.countryList}
          showsVerticalScrollIndicator={true}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#CC0000" />
              <Text style={styles.loadingText}>Loading countries...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#CC0000" />
              <Text style={styles.errorText}>Failed to load countries</Text>
              <Text style={styles.errorSubText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={loadCountries}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : countries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No countries available</Text>
            </View>
          ) : filteredCountries.length === 0 && searchQuery ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No countries found matching "{searchQuery}"</Text>
            </View>
          ) : (
            filteredCountries.map((item, index) => (
              <TouchableOpacity 
                key={`${item.name}-${item.flag}-${index}`} 
                style={styles.countryItem}
                onPress={() => {
                  try {
                    navigation?.navigate('DataPlanScreen', {
                      countryName: item.name,
                      countryFlag: item.flag
                    });
                  } catch (error) {
                    console.error('Navigation error:', error);
                  }
                }}
              >
                <View style={styles.flagContainer}>
                  {item.flag && typeof item.flag === 'string' ? (
                    <Image 
                      source={{ uri: `https://flagcdn.com/w40/${item.flag}.png` }} 
                      style={styles.flagIcon}
                      onError={() => {
                        // Silently handle flag image errors
                      }}
                    />
                  ) : null}
                </View>
                <Text style={styles.countryName}>{item.name}</Text>
                {item.price && (
                  <Text style={styles.countryPrice}>{item.price}</Text>
                )}
                <Ionicons name="chevron-forward" size={20} color="#999" style={styles.chevronIcon} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {activeTab === 'Regional' && (
        <ScrollView 
          style={styles.regionalListContainer}
          contentContainerStyle={styles.regionalListContent}
          showsVerticalScrollIndicator={true}
        >
          {loadingRegional ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#CC0000" />
              <Text style={styles.loadingText}>Loading regions...</Text>
            </View>
          ) : filteredRegions.length === 0 && searchQuery ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No regions found matching "{searchQuery}"</Text>
            </View>
          ) : (
            <View style={styles.regionsList}>
              {filteredRegions.map((region, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.regionItem}
                  onPress={() => {
                    try {
                      navigation?.navigate('RegionalESimsScreen', { region: region.name });
                    } catch (error) {
                      console.error('Navigation error:', error);
                    }
                  }}
                >
                  <View style={[styles.regionIconContainer, { backgroundColor: region.iconColor || 'transparent' }]}>
                    {region.useImageIcon ? (
                      <RegionIcon source={region.iconImage} size={24} />
                    ) : region.useCustomIcon ? (
                      <RedGlobeIcon size={24} />
                    ) : (
                      <Ionicons 
                        name={region.icon || 'map-outline'} 
                        size={24} 
                        color="#fff" 
                      />
                    )}
                  </View>
                  <Text style={styles.regionName}>{region.name}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {activeTab === 'Global' && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>{t('home.globalComingSoon')}</Text>
        </View>
      )}
      
      {/* WhatsApp Floating Action Button */}
      <TouchableOpacity 
        style={styles.whatsappButton}
        onPress={openWhatsApp}
        activeOpacity={0.8}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="logo-whatsapp" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}



export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    padding: 0, 
    backgroundColor: '#fff',
    flex: 1,
    position: 'relative',
  },
  header: {
    backgroundColor: "#CC0000",
    paddingVertical: 0,
    alignItems: "center",
    overflow: 'hidden',
    resizeMode: 'contain',
    zIndex: 0,
    height: 300,
    margin: 0,
    padding: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    zIndex: 2,
    position: 'absolute',
    top: 40,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
    marginRight: 8,
  },
  micButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minWidth: 32,
    minHeight: 32,
  },
  recordingIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CC0000',
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#CC0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  bannerContainer: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 2,
    marginRight: 15,
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subTitleText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
    fontStyle: 'italic',
    fontFamily: 'Poppins',
  },

 header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle2: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },

  usageCard: {
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 0,
    marginTop: -160,
    marginHorizontal: 0,
    marginBottom: 0,
    zIndex: 10,
    width: '100%',
    alignSelf: 'center',
  },
  usageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  flagContainerCard: {
    width: 32,
    height: 32,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  flagCard: { 
    width: 32, 
    height: 32, 
    resizeMode: 'cover',
  },
  country: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  usageTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  usageText: { fontSize: 14, color: '#CC0000', fontWeight: 'bold' },
  usageTextGray: { fontSize: 14, color: '#999', fontWeight: '400' },
  progressBarContainer: {
    marginTop: 12,
    marginBottom: 4,
    width: '100%',
  },
  progressBar: { 
    height: 12, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 6, 
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: { 
    width: '80%', 
    height: '100%', 
    backgroundColor: '#CC0000', 
    borderRadius: 6,
  },
  expiry: { fontSize: 12, color: '#999', marginTop: 8 },
  sectionTitleContainer: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  tabRow: { 
    flexDirection: 'row', 
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 20,
    marginRight: 20,
  },
  tabSpacing: {
    marginRight: 8,
  },
  tab: { 
    flex: 1,
    height: 52,
    backgroundColor: '#fff', 
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabActive: { 
    flex: 1,
    height: 52,
    backgroundColor: '#CC0000', 
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: { 
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  countryListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  countryList: {
    paddingHorizontal: 0,
  },
  countryItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
    paddingVertical: 8,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9F5FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flagIcon: { 
    width: 32, 
    height: 32, 
    borderRadius: 16,
    resizeMode: 'cover',
  },
  countryName: { 
    fontSize: 16, 
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  priceButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  priceButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  adScrollView: {
    marginHorizontal: 0,
  },
  adScrollContent: {
    paddingHorizontal: 20,
  },
  adSlide: {
    width: screenWidth - 40, // Full width minus horizontal padding
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  adImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.4,
    resizeMode: 'cover',
  },
  adPromoImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 1,
    resizeMode: 'contain', // Changed to 'contain' to show full image without cropping
  },
  adTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 20,
    zIndex: 1,
  },
  adTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  adDescription: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 22,
    maxWidth: '85%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 3,
  },
  paginationDotActive: {
    backgroundColor: '#CC0000',
    width: 24,
    height: 6,
    borderRadius: 3,
  },
  regionalListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  regionalListContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  regionsList: {
    paddingTop: 10,
  },
  regionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  regionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  regionIconImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionIconImage: {
    tintColor: '#CC0000',
  },
  regionName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins',
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
  countryCountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
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
  countryPrice: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
    fontFamily: 'Poppins',
  },
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
