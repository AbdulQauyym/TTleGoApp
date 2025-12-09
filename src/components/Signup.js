import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BASE_WIDTH = 375;

// Responsive scaling function - safe version that doesn't access Dimensions at module level
const scaleSize = (size) => {
  // Return size as-is, scaling will be handled inside component with dimensions state
  return size;
};

export default function SignUpScreen({ navigation }) {
  const logoImg = require("../assets/Loginpage.png");
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
        // Use safe default
        setDimensions({ width: 375, height: 667 });
      }
    });
    
    return () => {
      try {
        subscription?.remove();
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  const SCREEN_WIDTH = dimensions?.width || 375;
  const SCREEN_HEIGHT = dimensions?.height || 667;
  const LOGO_WIDTH = SCREEN_WIDTH; // 100% of screen width
  const LOGO_HEIGHT = SCREEN_HEIGHT * 0.44; // 44% of screen height

  return (
  
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.imageContainer}>
        <Image
          source={logoImg}
          style={[styles.logoImage, { width: LOGO_WIDTH, height: LOGO_HEIGHT }]}
          resizeMode="cover"
        />
     </View>
      <View style={styles.form}>
        <Text style={styles.title}>Sign up</Text>
        <View style={styles.underline} />

        <TextInput style={styles.input} placeholder="demo@email.com" placeholderTextColor="#aaa" />
        <TextInput
          style={styles.input}
          placeholder="enter your password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#aaa"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>Already have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: {
    marginTop: 0,
    paddingTop: 0,
  },
  logoImage: {
    marginTop: 0,
  },
  form: { flex: 1, padding: 10, marginTop: -100 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  underline: { height: 2, width: 50, backgroundColor: '#CC0000', marginVertical: 4, marginBottom: 15 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: '#CC0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  link: { color: '#CC0000', fontWeight: 'bold' },
});
