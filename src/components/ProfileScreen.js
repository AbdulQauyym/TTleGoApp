// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ProfileScreen({navigation}) {
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

  const SCREEN_HEIGHT = dimensions?.height || 667;
  const HEADER_HEIGHT = SCREEN_HEIGHT * 0.38; // 38% of screen height
  const menuItems = [
    { label: 'Promos', icon: 'pricetags-outline', screen:'PromoScreen' },
    { label: 'Friends', icon: 'people-outline', screen:'InviteFriendsScreen' },
    { label: 'Help Center', icon: 'help-circle-outline', screen:'HelpCenterScreen'},
    { label: 'Settings', icon: 'settings-outline', screen:'ManageScreen' },
    { label: 'Order History', icon: 'receipt-outline', screen:'OrderHistoryScreen' },
    { label: 'About Us', icon: 'information-circle-outline', screen:'AboutScreen' },
  ];


const sim = require("../assets/sim.png");
const profile = require("../assets/profile.png");
  return (
    <ScrollView style={styles.container}>
         {/* Header */}
      <View style={[styles.header, { height: HEADER_HEIGHT }]}>
        <View style={styles.headerTop}>
       <View style={styles.profileImageContainer}>
         <Ionicons name="person-circle" size={60} color="#fff" />
       </View>
    <View style={styles.textContainer}>
    <Text style={styles.headerTitle}>Guest</Text>
          </View>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => {
              // Navigate to LoginScreen
              const parent = navigation.getParent();
              const rootNavigator = parent ? parent.getParent() : null;
              if (rootNavigator) {
                rootNavigator.navigate('LoginScreen');
              } else {
                navigation.navigate('LoginScreen');
              }
            }}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
  </View>
        <View style={styles.bannerContainer}>
     <HeaderScreen/>
        </View>
      </View>
  
  
      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoText}>Invite freinds, get USD 5 off</Text>
        <Image
          source={sim}
          style={styles.promoIcon}
        />
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} 
           onPress={() => {
             // Handle cross-tab navigation
             const parent = navigation.getParent();
             if (item.screen === 'PromoScreen') {
               // Navigate to Home tab, then PromoScreen
               if (parent) {
                 parent.navigate('Home', { screen: 'PromoScreen' });
               }
             } else if (item.screen === 'ManageScreen') {
               // Navigate to Manage tab
               if (parent) {
                 parent.navigate('Manage', { screen: 'ManageMain' });
               }
             } else {
               // Navigate within ProfileStack
               navigation.navigate(item.screen);
             }
           }}
          >
            <Ionicons name={item.icon} size={20} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}
        onPress={() => {
          // Navigate to root stack (WelcomeScreen)
          // Go up through ProfileStack -> MainTabs -> Root Stack
          const tabNavigator = navigation.getParent();
          const rootNavigator = tabNavigator ? tabNavigator.getParent() : null;
          if (rootNavigator) {
            rootNavigator.reset({
              index: 0,
              routes: [{ name: 'WelcomeScreen' }],
            });
          } else {
            // Fallback: try direct navigation
            navigation.navigate('WelcomeScreen');
          }
        }}
         >
        <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { padding: 0, backgroundColor: '#f5f5f5', marginBottom:10},
  promoBanner: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginRight:10,
    marginLeft:10,
     borderRadius: 15,
    position: 'absolute',
    top: 220,
    left: 0,
    right: 0,
    zIndex: 3,
       shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    zIndex: 2,
    position: 'absolute',
    top: 80,
  },
  bannerContainer: {
    marginTop: 60,
    zIndex: 1,
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
  },
  loginButton: {
    backgroundColor: '#1E3A8A', // Dark blue color like in snapshot
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  promoText: { flex: 1, fontSize: 14, fontWeight: 'bold', color: '#d00' },
  promoIcon: { width: 40, height: 40 },
  menu: { marginBottom: 0, marginTop: 10, backgroundColor: 'transparent', marginHorizontal: 0 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginVertical: 4,
       shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: { marginRight: 15 },
  menuLabel: { flex: 1, fontSize: 16, color: '#333' },
  chevron: { marginLeft: 8 },
  logoutButton: {
    backgroundColor: '#CC0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },

  header: {
    backgroundColor: "#CC0000",
    paddingVertical: 0,
    alignItems: "center",
    overflow: 'hidden',
    resizeMode: 'contain',
    zIndex: 0,
  },
  logoutIcon: { marginRight: 10 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
