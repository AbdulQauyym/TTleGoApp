// App.js
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import ManageScreen from './ManageScreen';
import ProfileScreen from './ProfileScreen';
import CartScreen from './cart.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Svg, { Path } from 'react-native-svg';
import HeaderScreen from './Header';
const Tab = createBottomTabNavigator();
const cercle = require("../assets/Ellipse14.png");
const cercle2 = require("../assets/Ellipse15.png");
function HomeScreen({navigation}) {
  return (

    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
   
  <HeaderScreen/>
       
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Hi Andrew!</Text>
          <Text style={styles.subGreeting}>Ready to start your day?</Text>
    
        <Text style={styles.headerTitle}>Your Balance</Text>
        <Text style={styles.headerTitle}>2345.34$</Text>
      </View>
     
      {/* eSIM Usage */}
       
      <View style={styles.usageCard}>
        <View style={styles.usageHeader}>
          <Image source={{ uri: 'https://flagcdn.com/w40/de.png' }} style={styles.flag} />

          <Text style={styles.country}>Germany</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DataPlanScreen')}>  
        <Text style={styles.usageText}>8GB / 10GB</Text>
        </TouchableOpacity>
         </View>
          <Text style={styles.expiry}>Expires on 28 May 2025</Text>
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>
       
      </View>
  </View>
      {/* Popular Countries */}
      <Text style={styles.sectionTitle}>Other Popular Country</Text>
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tabActive}><Text style={styles.tabText}>Local eSIMs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Regional eSIMs</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Global eSIMs</Text></TouchableOpacity>
      </View>


{/* Header */}
      <View style={styles.header2}>
        <Text style={styles.headerTitle2}>Countries</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CountrySelectScreen')}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>



      {/* Country List */}
      <View style={styles.countryList}>
        {[
          { name: 'Germany', date: 'Yesterday - 19:12', flag: 'de' },
          { name: 'Switzerland', date: 'May 29, 2023 - 19:12', flag: 'ch' },
          { name: 'Portugal', date: 'May 16, 2023 - 17:34', flag: 'pt' },
        ].map((item, index) => (
          <View key={index} style={styles.countryItem}>
            <Image source={{ uri: `https://flagcdn.com/w40/${item.flag}.png` }} style={styles.flag} />
            <View>
              <Text style={styles.countryName}>{item.name}</Text>
              <Text style={styles.countryDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}



export default function App() {
  return (
    // <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: () => <Icon name="home" size={20} /> }} />
        <Tab.Screen name="Manage" component={ManageScreen} options={{ tabBarIcon: () => <Icon name="settings" size={20} /> }} />
        <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: () => <Icon name="cart" size={20} /> }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Icon name="person" size={20} /> }} />
      </Tab.Navigator>
    // </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 0, backgroundColor: '#fff' },
 header: {
    backgroundColor: "#fff",
    paddingVertical: 0,
    alignItems: "center",
   overflow: 'hidden',
     resizeMode: 'contain',
     zIndex:1,
  },
   headerOverlay: {
    position: 'absolute',
    top: 60, // adjust for your status bar height
    left: 0,
    right: 0,
    alignItems: 'center', // centers horizontally
    justifyContent: 'center', // centers vertically (within this area)
    zIndex:1
  },
   headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  
 header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#888',
    fontSize: 14,
  },

  imageRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between', // items start from left
  height: 40,
     backgroundColor: "#CC0000",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingVertical: 50,
  paddingHorizontal: 1000,
  position: 'relative',
},
rightImage: {
  width: 200,
  height: 300,
  borderRadius: 0,
 marginRight: 0,
 marginTop:100,
 transform: [{ translateX: -30 }], // shift left by half width
 resizeMode: 'cover'
 
},



leftImage: {
  width: 100,
  height: 200,
  marginLeft: 130,
  marginTop:100

},
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  greeting: { fontSize: 30, fontWeight: 'bold',color: '#00000' },
  subGreeting: { fontSize: 14, color: '#00000',marginRight:200 },
  balanceCard: { marginBottom: 20,color: '#00000' },
  balanceLabel: { fontSize: 16, color: '#00000' },
  balanceAmount: { fontSize: 24, fontWeight: 'bold', color: '#000000' },
  usageCard: {height:100,width:380, backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 20 },
  usageHeader: { flexDirection: 'row', alignItems: 'center' },
  flag: { width: 30, height: 20, marginRight: 10 },
  country: { fontSize: 16, fontWeight: 'bold' },
  usageText: {marginLeft:170, marginTop: 10, fontSize: 14 },
  progressBar: { height: 8, backgroundColor: '#ddd', borderRadius: 4, marginVertical: 5 },
  progressFill: { width: '80%', height: '100%', backgroundColor: '#d00', borderRadius: 4 },
  expiry: { fontSize: 12, color: '#666',marginTop:20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  tabRow: { flexDirection: 'row', marginBottom: 10 },
  tab: { padding: 10, backgroundColor: '#eee', borderRadius: 20, marginRight: 10 },
  tabActive: { padding: 10, backgroundColor: '#d00', borderRadius: 20, marginRight: 10 },
  tabText: { color: '#000000'  },
  countryList: {},
  countryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  countryName: { fontSize: 16 },
  countryDate: { fontSize: 12, color: '#666' },
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
