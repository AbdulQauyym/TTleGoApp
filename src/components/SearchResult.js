import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

const countries = [
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

export default function CountrySelectScreen({navigation}) {
  const [search, setSearch] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recordingTimer = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: stop recording if component unmounts
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    };
  }, []);

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
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.countryRow}>
              <Image source={{ uri: item.flag }} style={styles.flag} />
              <Text style={styles.countryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />

        {/* Alphabet Index */}
        <ScrollView style={styles.alphabetContainer}>
          {alphabet.map((letter) => (
            <Text key={letter} style={styles.letter}>
              {letter}
            </Text>
          ))}
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
  },
  alphabetContainer: {
    marginLeft: 6,
  },
  letter: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "600",
    textAlign: "right",
    marginRight: 20,
    marginVertical: 2,
  },
});
