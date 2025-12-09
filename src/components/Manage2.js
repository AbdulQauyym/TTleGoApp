import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

function ManageScreen() {
  const [selectedTab, setSelectedTab] = useState('Expired');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Manage</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Current' && styles.activeTab]}
          onPress={() => setSelectedTab('Current')}
        >
          <Text style={[styles.tabText, selectedTab === 'Current' && styles.activeTabText]}>
            Current
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Expired' && styles.activeTab]}
          onPress={() => setSelectedTab('Expired')}
        >
          <Text style={[styles.tabText, selectedTab === 'Expired' && styles.activeTabText]}>
            Expired
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/595/595067.png' }} // Replace with your image
          style={styles.image}
        />
        <Text style={styles.title}>No Plan Yet</Text>
        <Text style={styles.subtitle}>Your expired plans will be stored here</Text>
      </View>
    </View>
  );
}

// Bottom Navigation
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home-outline';
            else if (route.name === 'Manage') iconName = 'folder-outline';
            else if (route.name === 'Cart') iconName = 'cart-outline';
            else if (route.name === 'Profile') iconName = 'person-outline';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={ManageScreen} />
        <Tab.Screen name="Manage" component={ManageScreen} />
        <Tab.Screen name="Cart" component={ManageScreen} />
        <Tab.Screen name="Profile" component={ManageScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 16 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 8,
    elevation: 3,
  },
  activeTab: { backgroundColor: 'red' },
  tabText: { color: '#000', fontWeight: 'bold' },
  activeTabText: { color: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: 'gray', marginTop: 8 },
});
