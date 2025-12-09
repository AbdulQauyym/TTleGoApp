// PromoScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

const NoProm = require("../assets/lock20.png");

export default function PromoScreen({navigation}) {
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });

  useEffect(() => {
    // Use safe dimensions utility
    const safeDimensions = require('../utils/dimensions').getSafeWindowDimensions();
    setDimensions(safeDimensions);
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      try {
        if (window && typeof window.width === 'number' && typeof window.height === 'number') {
          setDimensions({ width: window.width, height: window.height });
        }
      } catch (e) {
        setDimensions({ width: 375, height: 667 });
      }
    });

    return () => {
      try {
        subscription?.remove();
      } catch (e) {}
    };
  }, []);

  const width = dimensions?.width || 375;
  const SCREEN_HEIGHT = dimensions?.height || 667;
  const HEADER_HEIGHT = SCREEN_HEIGHT * 0.38; // 38% of screen height
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { height: HEADER_HEIGHT }]}>
        <View style={[styles.headerBackground, { height: HEADER_HEIGHT }]}>
          <HeaderScreen />
        </View>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('Profile', { screen: 'ProfileMain' });
              } else {
                navigation.goBack();
              }
            }}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>20% Off Fa Promo</Text>
          <View style={styles.headerSpacer} />
               </View>
                  </View>
              
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      {/* Illustration */}
      <Image
          source={NoProm}
        style={styles.illustration}
        resizeMode="contain"
      />
        
      {/* Promo Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Fall Into Savings – Exclusive 20% off</Text>
        <Text style={styles.subtitle}>Returning users get 20% off with code FALL 20</Text>
        <Text style={styles.subtitle}>Stay connected this autumn – offer ends</Text>
      </View>

      {/* Use Promo Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            // Navigate to UspromoScreen - both are in HomeStack
            const parent = navigation.getParent();
            if (parent) {
              // Navigate through tab navigator to Home stack, then to UspromoScreen
              parent.navigate('Home', { screen: 'UspromoScreen' });
            } else {
              // Direct navigation within HomeStack
              navigation.navigate('UspromoScreen');
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Use Promo</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
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
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  illustration: {
    width: '70%',
    height: '70%',
    maxWidth: 300,
    maxHeight: 300,
    marginTop: 30,
    marginBottom: 20,
  },
  textContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
