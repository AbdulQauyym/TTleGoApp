import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function TermsAndConditionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerOverlay}>
          <TouchableOpacity 
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using Nomad eSIM services, you accept and agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not use our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Service Description</Text>
          <Text style={styles.sectionText}>
            Nomad provides eSIM (embedded SIM) services that allow you to access mobile data networks in various countries. 
            Our services include data plans, activation support, and customer service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Eligibility</Text>
          <Text style={styles.sectionText}>
            You must be at least 18 years old to use our services. By using Nomad, you represent and warrant that you 
            have the legal capacity to enter into these Terms and Conditions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Account Registration</Text>
          <Text style={styles.sectionText}>
            To use our services, you must create an account and provide accurate, current, and complete information. 
            You are responsible for maintaining the confidentiality of your account credentials and for all activities 
            that occur under your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Payment and Billing</Text>
          <Text style={styles.sectionText}>
            All prices are displayed in the currency selected during purchase. Payment must be made in advance before 
            service activation. We accept major credit cards and other payment methods as displayed on our platform. 
            All sales are final unless otherwise stated.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Service Activation and Usage</Text>
          <Text style={styles.sectionText}>
            eSIM activation instructions will be provided upon purchase. Services are activated according to the plan 
            you select. Data usage is subject to fair use policies. Excessive usage may result in service throttling 
            or suspension.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Device Compatibility</Text>
          <Text style={styles.sectionText}>
            You are responsible for ensuring your device is compatible with eSIM technology. Nomad is not responsible 
            for device compatibility issues. Please check your device specifications before purchasing.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Refund Policy</Text>
          <Text style={styles.sectionText}>
            Refunds may be available for unused data plans within 7 days of purchase, subject to our refund policy. 
            Activated plans are non-refundable. Contact our support team for refund requests.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            Nomad shall not be liable for any indirect, incidental, special, or consequential damages arising from 
            the use or inability to use our services. Our total liability shall not exceed the amount paid for the 
            specific service in question.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Privacy</Text>
          <Text style={styles.sectionText}>
            Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to 
            understand how we collect, use, and protect your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Modifications to Terms</Text>
          <Text style={styles.sectionText}>
            Nomad reserves the right to modify these Terms and Conditions at any time. Changes will be effective 
            immediately upon posting. Continued use of our services after changes constitutes acceptance of the new terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contact Information</Text>
          <Text style={styles.sectionText}>
            For questions about these Terms and Conditions, please contact us through the Contact Us section in the app 
            or email us at support@nomad.com.
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
  backButton: {
    width: 40,
    zIndex: 4,
  },
  headerRight: {
    width: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
  },
});











