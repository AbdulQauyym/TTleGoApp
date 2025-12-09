import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderScreen from './Header';

const NoPromoIllustration = require("../assets/noPprom.png");

export default function UspromoScreen({navigation}) {
  const [promoCode, setPromoCode] = useState('');
  const [width, setWidth] = useState(375);
  
  useEffect(() => {
    // Use safe dimensions utility
    const safeDimensions = require('../utils/dimensions').getSafeWindowDimensions();
    setWidth(safeDimensions.width);
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      try {
        if (window && typeof window.width === 'number') {
          setWidth(window.width);
        }
      } catch (e) {
        setWidth(375);
      }
    });
    
    return () => {
      try {
        subscription?.remove();
      } catch (e) {}
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Promos</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      {/* Promo Code Input Field - Overlapping header */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="gift-outline" size={24} color="#999" style={styles.inputIcon} />
        <TextInput
          placeholder="Enter Code"
          style={styles.input}
          value={promoCode}
          onChangeText={setPromoCode}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* My Promos Label */}
        <Text style={styles.myPromosLabel}>My Promos</Text>

        {/* No Promo Available Content */}
        <View style={styles.noPromoContainer}>
          <Image
            source={NoPromoIllustration}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.inviteButton}
            onPress={() => navigation.navigate('InviteFriendsScreen')}
          >
            <Text style={styles.inviteButtonText}>Invite Friend</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.howItWorksButton}>
            <Text style={styles.howItWorksButtonText}>How It Works</Text>
          </TouchableOpacity>
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
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 8,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 10,
    flexGrow: 1,
  },
  inputContainer: {
    position: 'absolute',
    top: 200,
    left: 16,
    right: 16,
    zIndex: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  myPromosLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  noPromoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flex: 1,
  },
  illustration: {
    width: '70%',
    height: '60%',
    maxWidth: 300,
    maxHeight: 260,
    marginBottom: 20,
  },
  noPromoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  noPromoSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  buttonsContainer: {
    paddingBottom: 30,
    paddingHorizontal: 16,
  },
  inviteButton: {
    backgroundColor: '#CC0000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  howItWorksButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  howItWorksButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

