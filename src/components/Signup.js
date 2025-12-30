import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { registerUser } from '../services/api';

const BASE_WIDTH = 375;

// Responsive scaling function - safe version that doesn't access Dimensions at module level
const scaleSize = (size) => {
  // Return size as-is, scaling will be handled inside component with dimensions state
  return size;
};

export default function SignUpScreen({ navigation }) {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);
  const logoImg = require("../assets/Loginpage.png");
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSignup = async () => {
    // Validate inputs
    if (!email.trim()) {
      Alert.alert(
        t('signup.error') || 'Error',
        t('signup.emailRequired') || 'Email is required'
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        t('signup.error') || 'Error',
        t('signup.passwordRequired') || 'Password is required'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        t('signup.error') || 'Error',
        t('signup.passwordTooShort') || 'Password must be at least 6 characters long'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        t('signup.error') || 'Error',
        t('signup.passwordsDoNotMatch') || 'Passwords do not match'
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert(
        t('signup.error') || 'Error',
        t('signup.invalidEmail') || 'Please enter a valid email address'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword,
      });

      console.log('Signup successful:', result);

      Alert.alert(
        t('signup.success') || 'Success',
        result.message || t('signup.accountCreated') || 'Account created successfully!',
        [
          {
            text: t('signup.ok') || 'OK',
            onPress: () => {
              // Navigate to login screen
              navigation?.navigate('LoginScreen');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert(
        t('signup.error') || 'Error',
        error.message || t('signup.signupFailed') || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.title}>{t('signup.title')}</Text>
        <View style={styles.underline} />

        <TextInput
          style={styles.input}
          placeholder={t('signup.emailPlaceholder')}
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder={t('signup.passwordPlaceholder')}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder={t('signup.confirmPasswordPlaceholder')}
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('signup.createAccount')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text>{t('signup.alreadyHaveAccount')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.link}>{t('signup.login')}</Text>
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
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  link: { color: '#CC0000', fontWeight: 'bold' },
});
