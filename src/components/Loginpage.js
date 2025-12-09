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
  Linking,
  Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const SignInScreen = ({navigation}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });
  const logoImg = require("../assets/Loginpage.png");
  const googleIcon = require("../assets/googleicon.png");

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
  
  // Calculate percentage-based dimensions for logo
  const LOGO_WIDTH = SCREEN_WIDTH * 1.15; // 115% of screen width
  const LOGO_HEIGHT = SCREEN_HEIGHT * 0.44; // 44% of screen height

const handleLogin = () => {
    if (username === "Admin" && password === "1234") {
       navigation.navigate("MainTabs"); // Navigate to MainTabs after login
    } else {
      Alert.alert("Login Failed", "Invalid username or password");
    }
  };

  return (
    
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Image
          source={logoImg}
          style={[styles.logoImage, { width: LOGO_WIDTH, height: LOGO_HEIGHT }]}
        />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            // Navigate to ProfileScreen via MainTabs -> Profile tab -> ProfileScreen
            navigation.navigate('MainTabs', {
              screen: 'Profile',
              params: {
                screen: 'ProfileScreen'
              }
            });
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Sign in</Text>
          <View style={styles.underline} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

           {/* Header */}

        {/* Body */}
        <View style={styles.body}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="demo@email.com"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              keyboardType="username"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.row}>
         
          
             <TouchableOpacity
      style={styles.radioContainer}
      onPress={() => setRememberMe(!rememberMe)}
    >
      <View style={[styles.outerCircle, rememberMe && styles.outerCircleSelected]}>
       {rememberMe && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.label}>Remember Me</Text>
    </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('ForgetPasswordScreen')}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          {/* Social Login Icons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialIcon}
              onPress={() => Linking.openURL('https://accounts.google.com')}
            >
              <View style={styles.iconWrapper}>
                <Image source={googleIcon} style={styles.googleIcon} resizeMode="contain" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialIcon}
              onPress={() => Linking.openURL('https://appleid.apple.com')}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="logo-apple" size={24} color="#000000" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.socialIcon}
              onPress={() => Linking.openURL('mailto:support@example.com')}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="mail" size={24} color="#42A5F5" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an Account ? </Text>
            <TouchableOpacity
             onPress={() => navigation.navigate('SignUpScreen')}
            >
              <Text style={styles.signUp}>Sign up</Text>
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
    backgroundColor: '#ffffffff',
  },
  headerContainer: {
    position: 'relative',
  },
  logoImage: {
    marginTop: 0,
    alignSelf: 'center',
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
  scrollContent: {
    flexGrow: 1,
  },
  underline: { 
    height: 2, 
    width: 50, 
    backgroundColor: '#E53935', 
    marginVertical: 6,
     marginBottom: 20,
  },
  body: {
    paddingHorizontal: 0,


  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#E53935',
    marginRight: 8,
  },
  remember: {
    color: '#555',
    fontSize: 13,
  },
  forgot: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 20,
  },
  socialIcon: {
    marginHorizontal: 5,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    width: 40,
    height: 40,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: 14,
  },
  signUp: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 14,
  },
    innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#E53935',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginHorizontal: 10,
  },
  outerCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  outerCircleSelected: {
    borderColor: '#E53935',
  },
  radioLabel: {
    marginLeft: 10,
    fontSize: 16,
    marginRight:20
  },
});

export default SignInScreen;
