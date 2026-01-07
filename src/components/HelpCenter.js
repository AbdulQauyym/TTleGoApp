import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function HelpCenterScreen({navigation}) {
  const helpItems = [
    { id: 1, title: 'Installation and Activation', icon: 'download-outline' },
    { id: 2, title: 'Network and Speed', icon: 'globe-outline' },
    { id: 3, title: 'Other Issues', icon: 'warning-outline' },
    { id: 4, title: 'Contact Us', icon: 'mail-outline' },
    { id: 5, title: 'FAQ', icon: 'help-circle-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBackground}>
          <HeaderScreen />
        </View>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Center</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {helpItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card}
            onPress={() => {
              if (item.title === 'Installation and Activation') {
                navigation.navigate('InstallationAndActivationScreen');
              } else if (item.title === 'Contact Us') {
                navigation.navigate('ContactUsScreen');
              } else if (item.title === 'Other Issues') {
                navigation.navigate('OtherIssueScreen');
              } else if (item.title === 'Network and Speed') {
                navigation.navigate('NetworkSpeedScreen');
              } else if (item.title === 'FAQ') {
                navigation.navigate('FAQScreen');
              }
            }}
          >
            <Ionicons name={item.icon} size={24} color="#666" style={styles.icon} />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    zIndex: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    paddingVertical:50
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    marginRight: 16,
  },
  cardText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
});