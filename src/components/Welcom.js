import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSafeWindowDimensions, scaleSize } from '../utils/dimensions';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';


export default function WelcomeScreen({ navigation }) {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);
  // Start with safe defaults, update in useEffect
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });
  const logoImg = require("../assets/LogoImage2.png");
  const arrowImg = require("../assets/ArrowCont.png");

  useEffect(() => {
    // Update dimensions on mount to get actual values
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
    
  const handleContinue = () => {
    try {
      if (navigation && navigation.navigate) {
        navigation.navigate('MainTabs');
      }
    } catch (error) {
      // Silently handle navigation errors
    }
  };

  // Calculate percentage-based dimensions
  const TOP_CONTAINER_HEIGHT = SCREEN_HEIGHT * 0.62; // 62% of screen height

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Top Red Background with Wave Pattern */}
      <View style={[styles.topContainer, { height: TOP_CONTAINER_HEIGHT }]}>
        {/* Red Topographic Background */}
        <Image 
          source={logoImg} 
          style={styles.logoImage}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>{t('welcome.title')}</Text>
        <Text style={styles.subtitle}>
          {t('welcome.subtitle')}
        </Text>

        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{t('welcome.continue')}</Text>
         
          <View style={styles.circularButton}>
              <Image source={arrowImg} style={styles.arrowImage} resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    margin: 0,
    
    padding: 0,
  },
  topContainer: {
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 0,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    width: '100%',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Poppins',
    marginTop: -60,
  },
  subtitle: {
    color: '#B8B4AE',
    fontSize: 15,
    marginTop: 10,
    marginBottom: 40,
    width: '90%',
    fontFamily: 'Poppins',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#B8B4AE',
    fontWeight: '400',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  connectingLine: {
    width: 30,
    height: 2,
    backgroundColor: '#D7261E',
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  circularButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D7261E',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20
  },
  arrowImage: {
    width: 60,
    height: 60,
    marginRight: 20,
   
  },
});
