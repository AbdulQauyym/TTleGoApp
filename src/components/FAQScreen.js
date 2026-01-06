import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function FAQScreen({navigation}) {
  const [expandedItems, setExpandedItems] = useState({});

  const faqItems = [
    {
      id: 1,
      question: 'What is an eSIM?',
      answer: 'An eSIM (embedded SIM) is a digital SIM card that allows you to activate a cellular plan without needing a physical SIM card. It\'s built into your device and can be activated remotely.'
    },
    {
      id: 2,
      question: 'Which devices support eSIM?',
      answer: 'Most modern smartphones support eSIM, including iPhone XS and later, Google Pixel 3 and later, Samsung Galaxy S20 and later, and many other Android devices. Check your device specifications to confirm eSIM compatibility.'
    },
    {
      id: 3,
      question: 'How do I install and activate my eSIM?',
      answer: 'After purchasing, you\'ll receive a QR code via email. Go to Settings > Cellular/Mobile Data > Add Cellular Plan, then scan the QR code. Follow the on-screen instructions to complete activation.'
    },
    {
      id: 4,
      question: 'Can I use eSIM while keeping my physical SIM?',
      answer: 'Yes! Most devices support dual SIM functionality, allowing you to use both your physical SIM and eSIM simultaneously. You can have two phone numbers active at the same time.'
    },
    {
      id: 5,
      question: 'How long does it take to activate my eSIM?',
      answer: 'eSIM activation is usually instant. Once you scan the QR code and complete the setup, your eSIM should be active within a few minutes. In rare cases, it may take up to 24 hours.'
    },
    {
      id: 6,
      question: 'Can I transfer my eSIM to another device?',
      answer: 'No, eSIMs are device-specific and cannot be transferred. Once installed on a device, it cannot be moved to another device. You would need to purchase a new eSIM for a different device.'
    },
    {
      id: 7,
      question: 'What happens if I lose my phone or get a new device?',
      answer: 'If you lose your phone or get a new device, you\'ll need to purchase a new eSIM plan. eSIMs cannot be transferred between devices for security reasons.'
    },
    {
      id: 8,
      question: 'Do I need internet to activate my eSIM?',
      answer: 'Yes, you need an internet connection (Wi-Fi or mobile data) to download and activate your eSIM. Make sure you have a stable connection before starting the activation process.'
    },
    {
      id: 9,
      question: 'Can I use my eSIM in multiple countries?',
      answer: 'This depends on your plan. Some eSIM plans are country-specific, while regional or global plans allow you to use the same eSIM in multiple countries. Check your plan details before traveling.'
    },
    {
      id: 10,
      question: 'What should I do if my eSIM is not working?',
      answer: 'First, ensure your device supports eSIM and that you\'ve completed the activation process. Try restarting your device, checking your cellular settings, and ensuring you\'re in a coverage area. If issues persist, contact our support team.'
    },
    {
      id: 11,
      question: 'How do I check my data usage?',
      answer: 'You can check your data usage in your device\'s Settings > Cellular/Mobile Data. Select your eSIM line to see detailed usage information including data consumed and remaining balance.'
    },
    {
      id: 12,
      question: 'Can I top up or extend my eSIM plan?',
      answer: 'Yes, you can purchase additional data or extend your plan validity through our app or website. Simply select your active eSIM and choose a top-up option that suits your needs.'
    },
    {
      id: 13,
      question: 'What is the difference between local, regional, and global eSIM plans?',
      answer: 'Local plans work in a single country, regional plans cover multiple countries in a specific region (like Europe or Asia), and global plans work in many countries worldwide. Choose based on your travel needs.'
    },
    {
      id: 14,
      question: 'Do eSIMs expire?',
      answer: 'Yes, eSIM plans have a validity period (usually 7, 15, or 30 days). Once expired, you\'ll need to purchase a new plan. Make sure to use your data before the expiration date.'
    },
    {
      id: 15,
      question: 'Can I use eSIM for calls and SMS?',
      answer: 'Most eSIM plans focus on data connectivity. Some plans may include calling and SMS capabilities, but this varies by provider and plan type. Check your plan details for specific features.'
    }
  ];

  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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
          <Text style={styles.headerTitle}>FAQ</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.introText}>
          Find answers to commonly asked questions about eSIM and our services.
        </Text>

        {faqItems.map((item) => (
          <View key={item.id} style={styles.faqItem}>
            <TouchableOpacity 
              style={styles.questionContainer}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.questionText}>{item.question}</Text>
              <Ionicons 
                name={expandedItems[item.id] ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#CC0000" 
              />
            </TouchableOpacity>
            
            {expandedItems[item.id] && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Still have questions?</Text>
          <Text style={styles.helpText}>
            If you can't find the answer you're looking for, please contact our support team.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => navigation.navigate('ContactUsScreen')}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" style={styles.contactIcon} />
            <Text style={styles.contactButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    top: 60,
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
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  introText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 12,
    lineHeight: 22,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  helpSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#CC0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  contactIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



















