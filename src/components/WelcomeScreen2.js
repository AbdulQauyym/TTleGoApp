// src/components/Packeges.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

// width will be defined inside component

export default function DataPlanScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
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

  const plans = [
    { id: 1, data: '20', unit: 'GB', duration: '30 Days', price: '36.27', currency: 'USD' },
    { id: 2, data: '50', unit: 'GB', duration: '30 Days', price: '9.27', currency: 'USD' },
    { id: 3, data: '5', unit: 'GB', duration: '30 Days', price: '9', currency: 'USD' },
  ];

  const formatPrice = (price) => {
    const parts = price.split('.');
    if (parts.length === 2) {
      return { main: parts[0], cents: parts[1] };
    }
    return { main: price, cents: null };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Red Header Section with SVG Wave */}
        <View style={styles.header}>
          {/* Status Bar */}
          <View style={styles.statusBar}>
            <Text style={styles.time}>9:41</Text>
            <View style={styles.statusIcons}>
              <Ionicons name="cellular" size={16} color="#fff" />
              <Ionicons name="wifi" size={16} color="#fff" style={styles.statusIcon} />
              <Ionicons name="battery-full" size={16} color="#fff" style={styles.statusIcon} />
            </View>
          </View>

          {/* Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.countryInfo}>
              <Image
                source={{ uri: 'https://flagcdn.com/w40/us.png' }}
                style={styles.flag}
              />
              <Text style={styles.countryName}>United States</Text>
            </View>

            <TouchableOpacity style={styles.calendarButton}>
              <View style={styles.calendarIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#CC0000" />
              </View>
            </TouchableOpacity>
          </View>

          {/* SVG Wave at bottom of header */}
          <Svg
            height="60"
            width={width}
            style={styles.wave}
            viewBox={`0 0 ${width} 60`}
          >
            <Path
              fill="#fff"
              d={`M0,60 Q${width / 2},0 ${width},60 L${width},60 L0,60 Z`}
            />
          </Svg>
        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.chooseText}>Choose a data plan</Text>

            {/* Data Plan Cards */}
            {plans.map((plan) => {
              const priceParts = formatPrice(plan.price);
              const isSelected = selectedPlan === plan.id;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <View style={styles.planRow}>
                    <View style={styles.dataContainer}>
                      <Text style={styles.dataText}>
                        {plan.data} <Text style={styles.dataUnit}>{plan.unit}</Text>
                      </Text>
                    </View>
                    <Text style={styles.durationText}>{plan.duration}</Text>
                  </View>

                  <View style={styles.priceContainer}>
                    <Text style={styles.currencyText}>{plan.currency} </Text>
                    <Text style={styles.priceMain}>{priceParts.main}</Text>
                    {priceParts.cents && (
                      <Text style={styles.priceCents}>.{priceParts.cents}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.planDetailsButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      // Handle plan details
                    }}
                  >
                    <Text style={styles.planDetailsText}>Plan details</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Fixed Bottom Button */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => {
                if (selectedPlan) {
                  // Handle plan selection
                }
              }}
            >
              <Text style={styles.selectButtonText}>Select Plan</Text>
            </TouchableOpacity>
            <Text style={styles.bottomPrice}>USD 15</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#CC0000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#CC0000',
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  time: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 4,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#fff',
    padding: 2,
  },
  countryName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarButton: {
    padding: 8,
  },
  calendarIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    padding: 8,
  },
  wave: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -1, // Overlap slightly to hide any gap
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  chooseText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  planCardSelected: {
    borderColor: '#CC0000',
    borderWidth: 2,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dataContainer: {
    flex: 1,
  },
  dataText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  dataUnit: {
    fontSize: 20,
    fontWeight: '400',
    color: '#666',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CC0000',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currencyText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  priceMain: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  priceCents: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
  },
  planDetailsButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  planDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  selectButton: {
    backgroundColor: '#CC0000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPrice: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});