import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

const BASE_WIDTH = 375;

// Responsive scaling function - safe version that doesn't access Dimensions at module level
const scaleSize = (size) => {
  // Return size as-is, scaling will be handled inside component with dimensions state
  return size;
};

const ForgetPasswordScreen = ({ navigation }) => {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);
  const [email, setEmail] = useState("");
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

  const SCREEN_WIDTH = dimensions?.width || 375;
  const SCREEN_HEIGHT = dimensions?.height || 667;
  const LOGO_WIDTH = SCREEN_WIDTH; // 100% of screen width
  const LOGO_HEIGHT = SCREEN_HEIGHT * 0.44; // 44% of screen height

  const handleResetPassword = () => {
    if (email.trim() === "") {
      Alert.alert(t('forgotPassword.error'), t('forgotPassword.enterEmail'));
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('forgotPassword.error'), t('forgotPassword.validEmail'));
      return;
    }

    Alert.alert(
      t('forgotPassword.resetLinkSent'),
      t('forgotPassword.resetLinkMessage'),
      [
        {
          text: t('forgotPassword.ok'),
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const logoImg = require("../assets/Loginpage.png");

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Image
            source={logoImg}
            style={[styles.logoImage, { width: LOGO_WIDTH, height: LOGO_HEIGHT }]}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{t('forgotPassword.title')}</Text>
            <View style={styles.underline} />
          </View>
        </View>

        <View style={styles.body}>
          
          <Text style={styles.description}>
            {t('forgotPassword.description')}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('forgotPassword.email')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('forgotPassword.emailPlaceholder')}
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={handleResetPassword}>
            <Text style={styles.resetText}>{t('forgotPassword.sendResetLink')}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('forgotPassword.rememberPassword')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.loginLink}>{t('forgotPassword.login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    position: 'relative',
  },
  logoImage: {
    marginTop: 0,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  body: {
    paddingHorizontal: 0,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  underline: {
    height: 2,
    width: 50,
    backgroundColor: '#CC0000',
    marginVertical: 6,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    marginHorizontal: 10,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    marginHorizontal: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  resetBtn: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
  },
  resetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#555',
    fontSize: 14,
  },
  loginLink: {
    color: '#CC0000',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ForgetPasswordScreen;

