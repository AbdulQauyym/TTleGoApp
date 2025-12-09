import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function ContactUsScreen({navigation}) {
  const contactMethods = [
    {
      id: 1,
      title: 'Live Chat',
      icon: 'chatbubble-outline',
      details: ['Available 24/7', 'Chat with our support team instantly'],
      onPress: () => {
        navigation.navigate('LiveChatScreen');
      }
    },
    {
      id: 2,
      title: 'Email Support',
      icon: 'mail-outline',
      details: ['support@ttelgo.com', 'Send us an email and we\'ll respond within 24 hours'],
      onPress: () => {
        Linking.openURL('mailto:support@ttelgo.com');
      }
    },
    {
      id: 3,
      title: 'Phone Support',
      icon: 'call-outline',
      details: ['+44 7818 984385', 'Call us Monday-Friday, 9 AM - 6 PM GMT'],
      onPress: () => {
        Linking.openURL('tel:+447818984385');
      }
    },
    {
      id: 4,
      title: 'Office Address',
      icon: 'location-outline',
      details: ['TikTel Ltd. (UK)', '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom'],
      onPress: () => {
        // Handle address navigation or map opening
        const address = '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom';
        Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
      }
    },
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
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Us</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Introduction Section */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Get in Touch</Text>
          <Text style={styles.introText}>
            We're here to help! Reach out to us through any of the following channels.
          </Text>
        </View>

        {/* Contact Methods */}
        {contactMethods.map((method) => (
          <TouchableOpacity 
            key={method.id} 
            style={styles.contactCard}
            onPress={method.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={method.icon} size={24} color="#000" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{method.title}</Text>
              {method.details.map((detail, index) => (
                <Text key={index} style={styles.cardDetail}>{detail}</Text>
              ))}
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        ))}

        {/* Urgent Matters Note */}
        <View style={styles.urgentCard}>
          <View style={styles.urgentIconContainer}>
            <Ionicons name="information-circle" size={24} color="#fff" />
          </View>
          <Text style={styles.urgentText}>
            For urgent matters, please use Live Chat for the fastest response.
          </Text>
        </View>
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
    paddingTop: 80,
    zIndex: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 4,
    width: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    padding: 16,
    paddingTop: -100,
    paddingBottom: 30,
  },
  introSection: {
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Poppins',
  },
  introText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    fontFamily: 'Poppins',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  cardDetail: {
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
    fontFamily: 'Poppins',
  },
  urgentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  urgentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  urgentText: {
    flex: 1,
    fontSize: 14,
    color: '#E53935',
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
});

