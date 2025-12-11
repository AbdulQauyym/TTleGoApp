// ManageScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native';

import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ManageScreen({navigation}) {
  const [activeTab, setActiveTab] = useState('Current');
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

    return () => subscription?.remove();
  }, []);

  const SCREEN_HEIGHT = dimensions?.height || 667;
  const HEADER_HEIGHT = SCREEN_HEIGHT * 0.38; // 38% of screen height

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { height: HEADER_HEIGHT }]}>
          <HeaderScreen />
          <View style={styles.headerOverlay}>
            <View style={styles.headerLeft}>
              <TouchableOpacity 
                onPress={() => {
                  try {
                    if (navigation && navigation.goBack) {
                      navigation.goBack();
                    }
                  } catch (error) {
                    console.error('Navigation error:', error);
                  }
                }}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.greeting}>Manage</Text>
            <View style={styles.headerRight} />
          </View>
        </View>
     
        {/* Tabs - Overlapping SVG */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Current' && styles.activeTab]}
            onPress={() => setActiveTab('Current')}
          >
            <Text style={[styles.tabText, activeTab === 'Current' && styles.activeTabText]}>Current</Text>
          </TouchableOpacity>
          <View style={styles.tabSpacer} />
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Expired' && styles.activeTab]}
            onPress={() => setActiveTab('Expired')}
          >
            <Text style={[styles.tabText, activeTab === 'Expired' && styles.activeTabText]}>Expired</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Data Plan Card */}
          {activeTab === 'Current' && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Image
                  source={{ uri: 'https://flagcdn.com/w40/de.png' }}
                  style={styles.flag}
                />
                <Text style={styles.country}>Germany</Text>
                <Text style={styles.planType}>Trial</Text>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.row}>
                  <Text style={styles.label}>Coverage</Text>
                  <Text style={styles.value}>Germany</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: '#d00' }]}>1 GB - 3 Days</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Remaining data</Text>
                  <Text style={styles.value}>0.92 GB</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Expires in</Text>
                  <Text style={styles.value}>2 days / 5 hours</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.buttonOutline}
                  onPress={() => {
                    try {
                      if (navigation && navigation.navigate) {
                        navigation.navigate('DataPlanScreen', {
                          countryName: 'Germany',
                          countryFlag: 'de'
                        });
                      }
                    } catch (error) {
                      console.error('Navigation error:', error);
                    }
                  }}
                >
                  <Text style={styles.buttonOutlineText}>Buy Add-On</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.buttonFilled}
                  onPress={() => {
                    try {
                      if (navigation && navigation.navigate) {
                        // Pass plan data based on the current plan shown
                        navigation.navigate('DataPlan', {
                          countryName: 'Germany',
                          countryFlag: 'de',
                          planData: {
                            data: '1 GB',
                            duration: '3 Days',
                            newPrice: '0',
                            oldPrice: null
                          }
                        });
                      }
                    } catch (error) {
                      console.error('Navigation error:', error);
                    }
                  }}
                >
                  <Text style={styles.buttonFilledText}>View Detail</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Expired Tab Content */}
          {activeTab === 'Expired' && (
            <View style={styles.card}>
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No Expired Plans</Text>
                <Text style={styles.emptyStateSubtext}>Your expired plans will appear here</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: { 
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 0,
  },
  headerOverlay: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 3,
    paddingHorizontal: 16,
  },
  headerLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerRight: {
    width: 40,
  },
  backButton: {
    zIndex: 4,
  },
  greeting: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  tabContainer: {
    position: 'absolute',
    top: 200,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 4,
  },
  tabSpacer: {
    width: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  activeTab: {
    backgroundColor: '#CC0000',
    borderColor: '#CC0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 50
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  flag: { width: 30, height: 20, marginRight: 10 },
  country: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  planType: { fontSize: 14, color: '#999' },
  cardBody: { marginBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: { fontSize: 14, color: '#333' },
  value: { fontSize: 14, fontWeight: 'bold' },
  buttonRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonOutline: {
    width: '90%',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },

 buttonOutlineText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  buttonFilled: {
    width: '90%',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#CC0000',
    alignItems: 'center',
  },
  buttonFilledText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

});
