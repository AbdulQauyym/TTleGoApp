// ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';


export default function ProfileScreen({navigation}) {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });
  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);

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
    { label: t('profile.friends'), icon: 'people-outline', screen:'InviteFriendsScreen', key: 'friends' },
    { label: t('profile.helpCenter'), icon: 'help-circle-outline', screen:'HelpCenterScreen', key: 'helpCenter' },
    { label: t('profile.settings'), icon: 'settings-outline', screen:'ManageScreen', key: 'settings' },
    { label: t('profile.aboutUs'), icon: 'information-circle-outline', screen:'AboutScreen', key: 'aboutUs' },
    { label: t('profile.language'), icon: 'language-outline', screen:'LanguageSelectionScreen', key: 'language' },
  ];


const sim = require("../assets/sim.png");
const profile = require("../assets/profile.png");
  return (
    <ScrollView style={styles.container}>
         {/* Header */}
      <View style={[styles.header, { height: HEADER_HEIGHT }]}>
        <View style={styles.headerTop}>
       <TouchableOpacity 
         style={styles.profileImageContainer}
         onPress={() => setUserDetailsModalVisible(true)}
       >
         <Ionicons name="person-circle" size={60} color="#fff" />
       </TouchableOpacity>
    <TouchableOpacity 
      style={styles.textContainer}
      onPress={() => setUserDetailsModalVisible(true)}
    >
    <Text style={styles.headerTitle}>{t('profile.guest')}</Text>
          </TouchableOpacity>
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
            <Text style={styles.loginButtonText}>{t('profile.login')}</Text>
          </TouchableOpacity>
  </View>
        <View style={styles.bannerContainer}>
     <HeaderScreen/>
        </View>
      </View>
  
  
      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoText}>{t('profile.inviteFriends')}</Text>
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
             if (item.screen === 'ManageScreen') {
               // Navigate to Manage tab
               if (parent) {
                 parent.navigate('Manage', { screen: 'ManageMain' });
               }
             } else if (item.screen === 'LanguageSelectionScreen') {
               // Navigate to language selection
               const rootNavigator = parent ? parent.getParent() : null;
               if (rootNavigator) {
                 rootNavigator.navigate('LanguageSelectionScreen');
               } else {
                 navigation.navigate('LanguageSelectionScreen');
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
        <Text style={styles.logoutText}>{t('profile.logout')}</Text>
      </TouchableOpacity>

      {/* User Details Modal */}
      <Modal
        visible={userDetailsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setUserDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('profile.userDetails')}</Text>
              <TouchableOpacity onPress={() => setUserDetailsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* User Information */}
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.userInfoSection}>
                <View style={styles.userAvatarContainer}>
                  <Ionicons name="person-circle" size={100} color="#CC0000" />
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.name')}:</Text>
                  <Text style={styles.infoValue}>{t('profile.guestUser')}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.email')}:</Text>
                  <Text style={styles.infoValue}>guest@example.com</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.phone')}:</Text>
                  <Text style={styles.infoValue}>+1 (555) 000-0000</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.userId')}:</Text>
                  <Text style={styles.infoValue}>GUEST-12345</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.accountType')}:</Text>
                  <Text style={styles.infoValue}>{t('profile.guest')}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.memberSince')}:</Text>
                  <Text style={styles.infoValue}>--</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.totalOrders')}:</Text>
                  <Text style={styles.infoValue}>0</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('profile.pointsBalance')}:</Text>
                  <Text style={styles.infoValue}>0 pts</Text>
                </View>
              </View>
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setUserDetailsModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>{t('profile.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#CC0000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Poppins',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  userInfoSection: {
    padding: 20,
  },
  userAvatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    fontFamily: 'Poppins',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    fontFamily: 'Poppins',
    flex: 1,
    textAlign: 'right',
  },
  modalCloseButton: {
    backgroundColor: '#CC0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
    marginTop: 10,
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});
