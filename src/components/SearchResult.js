import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

// Default countries fallback
const defaultCountries = [
  { name: "Afghanistan", flag: "https://flagcdn.com/w40/af.png" },
  { name: "Albania", flag: "https://flagcdn.com/w40/al.png" },
  { name: "Algeria", flag: "https://flagcdn.com/w40/dz.png" },
  { name: "Andorra", flag: "https://flagcdn.com/w40/ad.png" },
  { name: "Angola", flag: "https://flagcdn.com/w40/ao.png" },
  { name: "Argentina", flag: "https://flagcdn.com/w40/ar.png" },
  { name: "Armenia", flag: "https://flagcdn.com/w40/am.png" },
  { name: "Australia", flag: "https://flagcdn.com/w40/au.png" },
  { name: "Austria", flag: "https://flagcdn.com/w40/at.png" },
  { name: "Azerbaijan", flag: "https://flagcdn.com/w40/az.png" },
  { name: "Bahamas", flag: "https://flagcdn.com/w40/bs.png" },
  { name: "Brazil", flag: "https://flagcdn.com/w40/br.png" },
];

const API_URL = 'https://www.ttelgo.com/api/plans/bundles/local';

export default function CountrySelectScreen({navigation}) {
  const [search, setSearch] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [countries, setCountries] = useState(defaultCountries);
  const [loading, setLoading] = useState(true);
  const [activeLetter, setActiveLetter] = useState(null);
  const recordingTimer = useRef(null);
  const flatListRef = useRef(null);
  const activeLetterTimeoutRef = useRef(null);

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🌐 Fetching countries from API for search...');
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to search format
      if (data && Array.isArray(data.bundles)) {
        // Create a map to store unique countries
        const countryMap = new Map();
        
        data.bundles.forEach(bundle => {
          if (bundle.countries && Array.isArray(bundle.countries) && bundle.countries.length > 0) {
            const country = bundle.countries[0]; // Take first country from bundle
            const countryName = country.name;
            const isoCode = (country.iso || '').toLowerCase();
            
            // Add country if not already in the map
            if (!countryMap.has(countryName)) {
              countryMap.set(countryName, {
                name: countryName,
                flag: `https://flagcdn.com/w40/${isoCode}.png`
              });
            }
          }
        });
        
        // Convert map to array and sort
        const countriesList = Array.from(countryMap.values());
        countriesList.sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(countriesList);
        console.log(`✅ Loaded ${countriesList.length} countries from API`);
      } else {
        console.warn('⚠️ API returned invalid data, using default countries');
        setCountries(defaultCountries);
      }
    } catch (error) {
      console.error('❌ Error fetching countries:', error);
      console.log('Using default countries');
      setCountries(defaultCountries);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch countries from API
  useEffect(() => {
    loadCountries();
    
    return () => {
      // Cleanup: stop recording if component unmounts
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
      // Cleanup: clear active letter timeout
      if (activeLetterTimeoutRef.current) {
        clearTimeout(activeLetterTimeoutRef.current);
      }
    };
  }, [loadCountries]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        if (grants['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert('Permission Denied', 'Audio recording requires microphone permission.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    setIsRecording(true);
    console.log('Recording started');
    
    // Simulate recording with a timer (in a real app, this would start actual audio recording)
    // For now, we'll just show the UI state change
    Alert.alert('Recording Started', 'Audio recording has started. Tap the mic icon again to stop.');
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current);
      recordingTimer.current = null;
    }
    console.log('Recording stopped');
    Alert.alert('Recording Stopped', 'Audio recording has been stopped.');
  };

  const handleMicPress = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Find the index of the first country starting with a letter
  const findCountryIndexByLetter = (letter) => {
    const upperLetter = letter.toUpperCase();
    return filteredCountries.findIndex((country) => 
      country.name.toUpperCase().startsWith(upperLetter)
    );
  };

  // Handle alphabet letter press
  const handleLetterPress = (letter) => {
    const index = findCountryIndexByLetter(letter);
    if (index !== -1 && flatListRef.current && filteredCountries.length > 0) {
      try {
        flatListRef.current.scrollToIndex({ 
          index, 
          animated: true,
          viewPosition: 0 // Scroll to top of the item
        });
        setActiveLetter(letter);
        // Clear previous timeout if exists
        if (activeLetterTimeoutRef.current) {
          clearTimeout(activeLetterTimeoutRef.current);
        }
        // Clear active letter after a short delay
        activeLetterTimeoutRef.current = setTimeout(() => {
          setActiveLetter(null);
        }, 1000);
      } catch (error) {
        console.log('Scroll to index error:', error);
        // Fallback: scroll to offset
        const itemHeight = 50;
        flatListRef.current?.scrollToOffset({
          offset: index * itemHeight,
          animated: true,
        });
      }
    }
  };

  // Handle scroll to update active letter
  const handleScroll = (event) => {
    if (filteredCountries.length === 0) return;
    
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const itemHeight = 50; // Approximate height of each country row
    
    // Calculate which item is currently visible
    const visibleIndex = Math.floor(scrollOffset / itemHeight);
    
    if (visibleIndex >= 0 && visibleIndex < filteredCountries.length) {
      const country = filteredCountries[visibleIndex];
      if (country && country.name) {
        const firstLetter = country.name.charAt(0).toUpperCase();
        if (alphabet.includes(firstLetter) && activeLetter !== firstLetter) {
          setActiveLetter(firstLetter);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.headerTitle}>Search</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        {/* Search Container in Header */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search ...."
              placeholderTextColor="#999"  
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity onPress={handleMicPress}>
              <Ionicons 
                name={isRecording ? "mic" : "mic-outline"} 
                size={22} 
                color={isRecording ? "#CC0000" : "#999"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Country List with Alphabet Sidebar */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#CC0000" />
            <Text style={styles.loadingText}>Loading countries...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={filteredCountries}
            keyExtractor={(item) => item.name}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            getItemLayout={(data, index) => {
              const itemHeight = 50;
              if (index < 0 || (data && index >= data.length)) {
                return { length: itemHeight, offset: itemHeight * index, index };
              }
              return {
                length: itemHeight, // Height of each country row
                offset: itemHeight * index,
                index,
              };
            }}
            onScrollToIndexFailed={(info) => {
              // Handle scroll to index failure gracefully
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                if (flatListRef.current && info.index >= 0 && info.index < filteredCountries.length) {
                  try {
                    flatListRef.current.scrollToIndex({ 
                      index: info.index, 
                      animated: true 
                    });
                  } catch (error) {
                    // Fallback to scrollToOffset
                    const itemHeight = 50;
                    flatListRef.current?.scrollToOffset({
                      offset: info.index * itemHeight,
                      animated: true,
                    });
                  }
                }
              });
            }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.countryRow}
                onPress={() => {
                  try {
                    // Extract ISO code from flag URL for navigation
                    const flagUrl = item.flag;
                    const isoMatch = flagUrl.match(/\/([a-z]{2})\.png$/i);
                    const isoCode = isoMatch ? isoMatch[1] : item.name.toLowerCase().substring(0, 2);
                    
                    navigation?.navigate('DataPlanScreen', {
                      countryName: item.name,
                      countryFlag: isoCode
                    });
                  } catch (error) {
                    console.error('Navigation error:', error);
                  }
                }}
              >
                <Image 
                  source={{ uri: item.flag }} 
                  style={styles.flag}
                  onError={() => {
                    // Silently handle flag image errors
                  }}
                />
                <Text style={styles.countryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No countries found</Text>
              </View>
            }
          />
        )}

        {/* Alphabet Index */}
        <ScrollView style={styles.alphabetContainer}>
          {alphabet.map((letter) => {
            const hasCountries = findCountryIndexByLetter(letter) !== -1;
            const isActive = activeLetter === letter;
            
            return (
              <TouchableOpacity
                key={letter}
                onPress={() => handleLetterPress(letter)}
                disabled={!hasCountries}
                style={styles.letterContainer}
              >
                <Text 
                  style={[
                    styles.letter,
                    !hasCountries && styles.letterDisabled,
                    isActive && styles.letterActive
                  ]}
                >
                  {letter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
  headerSpacer: {
    width: 24,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    zIndex: 3,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 12,
    width: "100%",
    height: 45,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: "#000",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  countryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 3,
  },
  countryName: {
    fontSize: 16,
    color: "#333",
    flex: 1,
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
  alphabetContainer: {
    marginLeft: 6,
  },
  letterContainer: {
    paddingVertical: 2,
  },
  letter: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "600",
    textAlign: "right",
    marginRight: 20,
    marginVertical: 2,
  },
  letterDisabled: {
    color: "#CCCCCC",
    opacity: 0.5,
  },
  letterActive: {
    color: "#CC0000",
    fontWeight: "bold",
    fontSize: 14,
  },
});
