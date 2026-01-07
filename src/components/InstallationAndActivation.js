import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function InstallationAndActivationScreen({ navigation }) {
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
          <Text style={styles.headerTitle}>Installation and Activation</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>

        <View style={styles.section}>
          <Text style={styles.companyTitle}>TTelGo eSIM Installation & Activation Guide</Text>
          <Text style={styles.companyInfo}>
            TTelGo eSIM is operated by TikTel Ltd, a company incorporated under the laws of England and Wales, with license number 16154601, and registered office at 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
          </Text>
          <Text style={styles.sectionText}>
            Follow these step-by-step instructions to install and activate your TTelGo eSIM. The process is quick and easy, typically taking just a few minutes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Before You Begin</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Ensure your device supports eSIM technology. Most modern smartphones (iPhone XS and later, Samsung Galaxy S20 and later, Google Pixel 3 and later) support eSIM.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Make sure you have a stable internet connection (Wi-Fi recommended) for downloading the eSIM profile.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Keep your order confirmation email or reference number handy, as you may need it during installation.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Installation Methods</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>QR Code Method: Scan the QR code provided in your order confirmation email or in the app.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Manual Entry Method: Enter the SMDP+ address and activation code manually if QR code scanning is not available.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Direct URL Method: Click the installation link provided in your confirmation email (iOS devices).</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. iOS Installation Steps</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Go to Settings → Cellular (or Mobile Data).</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Tap "Add Cellular Plan" or "Add eSIM".</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Choose "Use QR Code" and scan the QR code from your order confirmation, or select "Enter Details Manually" to input the SMDP+ address and activation code.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Follow the on-screen prompts to complete installation.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Once installed, you can label your eSIM (e.g., "TTelGo Travel") and set it as your primary or secondary line.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Android Installation Steps</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Go to Settings → Network & Internet → SIMs (or Mobile Network → SIMs).</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Tap "Add Mobile Plan" or "Download a SIM instead".</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Select "Use QR Code" and scan the QR code, or choose "Enter Code" to manually enter the SMDP+ address and activation code.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Follow the installation prompts and wait for the eSIM profile to download and activate.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Once activated, you can manage your eSIM settings, including enabling/disabling it and setting it as your default data line.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Activation Process</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>After installation, your eSIM will automatically activate when you arrive in the destination country or when you manually enable it.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Activation typically occurs within a few minutes of installation, but may take up to 24 hours in some cases.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You will receive a confirmation notification once your eSIM is active and ready to use.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>To check activation status, go to your device's cellular settings and verify that the eSIM shows as "Active" or "On".</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Troubleshooting</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>If QR code scanning fails, try using the manual entry method with the SMDP+ address and activation code from your order confirmation.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Ensure your device is connected to Wi-Fi during installation, as cellular data may not be available until the eSIM is activated.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>If installation fails, restart your device and try again. Make sure you have sufficient storage space available.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>For persistent issues, contact our support team at support@ttelgo.com with your order reference number.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Important Notes</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Do not delete the eSIM profile from your device once installed, as this will deactivate your service.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You can install the eSIM before traveling, but it will only activate when you reach the destination country or manually enable it.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Keep your order confirmation email safe, as it contains important installation details and your eSIM reference number.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Some devices may require you to set the eSIM as your default data line for it to work properly.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Need More Help?</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Visit our FAQ section for answers to common installation questions.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Contact our 24/7 support team via email at support@ttelgo.com or through the in-app chat feature.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Include your order reference number and device model when contacting support for faster assistance.</Text>
          </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
    textAlign: 'left',
  },
  section: {
    marginBottom: 28,
    marginTop: 4,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  companyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 8,
    marginTop: 8,
    paddingVertical: 8,
  },
  companyInfo: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'justify',
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
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    marginTop: 6,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
  },
});

