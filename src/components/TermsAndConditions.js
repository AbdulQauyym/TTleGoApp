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
          <Text style={styles.companyTitle}>TTelGo eSIM – Terms & Conditions</Text>
          <Text style={styles.companyInfo}>
            TTelGo eSIM is operated by TikTel Ltd, a company incorporated under the laws of England and Wales, with license number 16154601, and registered office at 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom.
          </Text>
          <Text style={styles.sectionText}>
            By accessing or using TTelGo eSIM services, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, you must not use the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Service Overview</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TTelGo eSIM provides prepaid digital SIM profiles enabling mobile data usage abroad without requiring a physical SIM card.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Services are offered subject to availability and may vary depending on device compatibility and local network coverage.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Registration & Eligibility</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Users must register via the TTelGo mobile application or website.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>By registering, you agree to comply with these Terms & Conditions and any operational rules or policies published by TikTel Ltd.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You must be at least 18 years old or have parental consent to use the service.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Privacy & Data Protection</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TikTel Ltd complies with the UK GDPR and Data Protection Act 2018.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Personal data collected during registration and usage will be processed lawfully, securely, and only for service provision, customer support, and product improvement.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You may request correction or deletion of your personal data at any time by contacting support@ttelgo.com.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>We may collect technical information (device type, operating system, IP address, usage logs) to improve service reliability.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>All trademarks, logos, and intellectual property associated with TTelGo eSIM remain the property of TikTel Ltd.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You may not reproduce, distribute, or use our branding or copyrighted materials without prior written consent.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Account & Activation</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Activation requires installation of the TTelGo eSIM profile on a compatible device.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Device compatibility must be checked before purchase; refunds will not be issued for incompatible devices.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Accounts may be deactivated if unused for more than 90 days without a valid data package.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Charges & Payments</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Payments are processed securely via third-party providers (e.g., Stripe) in GBP or USD.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>All transactions comply with PCI DSS Level 1 standards.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>By purchasing, you agree to pay applicable bundle charges and taxes.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Termination</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You may terminate the service at any time.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TikTel Ltd may suspend or terminate accounts for misuse, unlawful activity, or breach of these Terms.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>No refunds are provided for unused data or subscription periods upon termination.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. User Responsibilities</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You agree to use TTelGo eSIM lawfully and not for fraudulent, abusive, or harmful purposes.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You are responsible for ensuring your device is unlocked and compatible.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You must notify us immediately if your device is lost or stolen.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Indemnity</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>You agree to indemnify TikTel Ltd against claims, damages, or liabilities arising from misuse of the service.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TikTel Ltd is not liable for indirect losses such as lost profits, business interruption, or reputational damage.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Liability is limited to the total amount paid by you in the 12 months preceding the claim.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>This does not exclude liability for death or personal injury caused by negligence.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Modifications</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TikTel Ltd reserves the right to amend these Terms & Conditions or discontinue services with notice provided via the app or website.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Continued use of the service after changes constitutes acceptance.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Governing Law & Jurisdiction</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>These Terms & Conditions are governed by the laws of England & Wales.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Any disputes shall be subject to the exclusive jurisdiction of the courts of London.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Third-Party Services</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Access to third-party websites or resources is at your own risk. TikTel Ltd is not responsible for their content or reliability.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Force Majeure</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>TikTel Ltd shall not be liable for service interruptions caused by events beyond its reasonable control (e.g., natural disasters, technical failures, regulatory changes).</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Warranties</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Services are provided with reasonable skill and care.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>No guarantee is made regarding uninterrupted availability or compatibility with all devices.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Referral & Rewards Program</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Users may earn rewards for referring new customers, subject to program rules published within the app.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>Rewards are non-transferable and may be amended or withdrawn at TikTel Ltd's discretion.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Complaints</Text>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>For questions, concerns, or complaints, please contact support@ttelgo.com.</Text>
          </View>
          <View style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listText}>We aim to resolve disputes amicably and in compliance with UK consumer protection laws.</Text>
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
});











