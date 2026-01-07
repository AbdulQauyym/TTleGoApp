import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function PrivacyPolicyScreen({ navigation }) {
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
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.headerRight} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString()}</Text>

        <View style={styles.section}>
          <Text style={styles.companyTitle}>TTelGo eSIM Privacy Policy</Text>
          <Text style={styles.companyInfo}>
            TTelGo eSIM is operated by TikTel Ltd, a company incorporated under the laws of England and Wales, with license number 16154601, and registered office at 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
          </Text>
          <Text style={styles.sectionText}>
            By accessing or using TTelGo eSIM, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Commitment to Privacy</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TikTel Ltd is committed to safeguarding your personal information.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>We employ industry-standard security technologies and procedures to protect your data against unauthorized access, use, or disclosure.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>While we take all reasonable steps to secure your information, no system is completely immune to risk, and we cannot guarantee absolute security.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Registration Data:</Text> Information you provide when creating an account (e.g., name, email address, payment details).</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Usage Data:</Text> Technical information such as device type, operating system, IP address, and logs of how you use TTelGo eSIM.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Communications:</Text> Feedback, support requests, or other interactions with our team.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>To provide and maintain TTelGo eSIM services.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>To contact you regarding service updates, feedback requests, or new product offerings.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>To troubleshoot issues, analyze usage patterns, and improve service performance.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>To comply with legal obligations under UK law.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Deletion & Account Management</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You may request adjustment or deletion of your personal data at any time.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Account deletion can be initiated directly through the TTelGo app:</Text>
          </View>
          <View style={styles.nestedItem}>
            <Text style={styles.numberedText}>1. Navigate to the "Delete Account" screen.</Text>
          </View>
          <View style={styles.nestedItem}>
            <Text style={styles.numberedText}>2. Enter your registered email address.</Text>
          </View>
          <View style={styles.nestedItem}>
            <Text style={styles.numberedText}>3. Confirm the deletion request by pressing "Delete."</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Please note: deleting your TTelGo account does not automatically deactivate your active eSIM profile. You may continue to use your eSIM line until its validity period expires.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>For assistance, contact support@ttelgo.com.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Retention</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>We retain your personal data only for as long as necessary to provide services or comply with legal requirements.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Once retention is no longer required, your data will be securely deleted or anonymized.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Sharing of Information</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TikTel Ltd does not sell or rent your personal information.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Data may be shared with trusted third-party service providers (e.g., payment processors) solely for the purpose of delivering services.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Any sharing complies with UK GDPR requirements and contractual safeguards.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Your Rights</Text>
          <Text style={styles.rightsIntro}>Under UK GDPR, you have the following rights:</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Access:</Text> Request a copy of the personal data we hold about you.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Correction:</Text> Request updates or corrections to inaccurate information.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Deletion:</Text> Request erasure of your personal data.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Restriction:</Text> Request limits on how we process your data.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Portability:</Text> Request transfer of your data to another provider.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}><Text style={styles.boldText}>Objection:</Text> Object to certain types of processing, including direct marketing.</Text>
          </View>
          <Text style={styles.rightsNote}>Requests can be made by contacting support@ttelgo.com.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Policy Updates</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>This Privacy Policy may be revised from time to time.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Any changes will be communicated via the TTelGo app or website.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Continued use of the service after notification constitutes acceptance of the updated policy.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Responsibility for Accuracy</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You are responsible for ensuring that the personal information you provide is accurate and up to date.</Text>
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
    marginBottom: 28,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  sectionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  companyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  companyInfo: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
    fontStyle: 'italic',
    backgroundColor: '#F5F5F5',
    padding: 14,
    borderRadius: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    marginTop: 7,
    marginRight: 12,
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
  },
  boldText: {
    fontWeight: '600',
    color: '#333',
  },
  nestedItem: {
    marginLeft: 20,
    marginBottom: 8,
    paddingLeft: 12,
  },
  numberedText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  rightsIntro: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  rightsNote: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

