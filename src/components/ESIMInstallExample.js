/**
 * Example Component: How to Use eSIM Installation
 * 
 * This is a simple example showing how to integrate eSIM installation
 * into your app. You can use this as a reference or integrate it into
 * your existing order/purchase flow.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  createESIMOrder,
  getOrderDetails,
  getESIMInstallDetails,
  getESIMInstallURL,
} from '../services/api';

export default function ESIMInstallExample({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [orderReference, setOrderReference] = useState(null);

  /**
   * Example 1: Complete Purchase and Installation Flow
   * This function demonstrates the complete flow from purchase to installation
   */
  const handlePurchaseAndInstall = async (bundleName) => {
    try {
      setLoading(true);

      // Step 1: Create an order
      console.log('Creating eSIM order...');
      const orderResult = await createESIMOrder({
        bundleName: bundleName, // e.g., 'esim_1GB_7D_GB_V2'
        quantity: 1,
        autoAssign: true, // Automatically assign eSIM if available
      });

      const reference = orderResult.reference || orderResult.orderReference;
      setOrderReference(reference);
      console.log('Order created with reference:', reference);

      // Step 2: Get order details (optional - to verify order)
      const orderDetails = await getOrderDetails(reference);
      console.log('Order details:', orderDetails);

      // Step 3: Navigate to installation screen
      // Option A: Use the ready-made ESIMInstallScreen component
      navigation.navigate('ESIMInstall', {
        reference: reference,
      });

      // Option B: Or handle installation directly (see handleDirectInstall below)

    } catch (error) {
      console.error('Error in purchase flow:', error);
      Alert.alert('Error', error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Example 2: Direct Installation (Alternative to ESIMInstallScreen)
   * This shows how to handle installation directly without the screen component
   */
  const handleDirectInstall = async (reference) => {
    try {
      setLoading(true);

      // Get eSIM install details
      const installDetails = await getESIMInstallDetails(reference, {
        format: 'json',
        additionalFields: 'appleInstallUrl',
      });

      // Handle array response (multiple eSIMs)
      const esimData = Array.isArray(installDetails) 
        ? installDetails[0] 
        : installDetails;

      console.log('eSIM Details:', {
        iccid: esimData.iccid,
        smdpAddress: esimData.smdpAddress,
        matchingId: esimData.matchingId,
        profileStatus: esimData.profileStatus,
      });

      // Get installation URL
      const installURL = await getESIMInstallURL(reference);
      console.log('Install URL:', installURL);

      // Show details to user
      Alert.alert(
        'eSIM Ready',
        `ICCID: ${esimData.iccid}\n\nWould you like to install now?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Install',
            onPress: async () => {
              try {
                // Try to open installation URL
                const canOpen = await Linking.canOpenURL(installURL);
                if (canOpen) {
                  await Linking.openURL(installURL);
                } else {
                  // Fallback: Show manual instructions
                  Alert.alert(
                    'Manual Installation Required',
                    `SMDP+ Address: ${esimData.smdpAddress}\nMatching ID: ${esimData.matchingId}\n\nGo to Settings > Cellular to enter these manually.`,
                  );
                }
              } catch (linkError) {
                console.error('Error opening install URL:', linkError);
                Alert.alert('Error', 'Could not open installation URL');
              }
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error installing eSIM:', error);
      Alert.alert('Error', error.message || 'Failed to get installation details');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Example 3: Get QR Code
   * This shows how to get and display QR code
   */
  const handleGetQRCode = async (reference) => {
    try {
      setLoading(true);

      // Get QR code as ZIP file
      const qrZip = await getESIMInstallDetails(reference, { format: 'zip' });

      // Note: In a real app, you would:
      // 1. Extract the ZIP file
      // 2. Get the PNG image(s) from it
      // 3. Display using <Image> component
      // 4. Allow user to scan with their device

      console.log('QR Code ZIP received:', qrZip);
      Alert.alert(
        'QR Code Ready',
        'QR code ZIP file downloaded. Extract and display the PNG image for scanning.',
      );
    } catch (error) {
      console.error('Error getting QR code:', error);
      Alert.alert('Error', error.message || 'Failed to get QR code');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Example 4: Integration with Existing Order
   * Use this when you already have an order reference
   */
  const handleInstallFromExistingOrder = async () => {
    // This would typically come from your order history or purchase confirmation
    const existingReference = 'YOUR_ORDER_REFERENCE';

    // Navigate to installation screen
    navigation.navigate('ESIMInstall', {
      reference: existingReference,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>eSIM Installation Examples</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Example 1: Purchase & Install</Text>
        <Text style={styles.description}>
          Complete flow from purchase to installation
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePurchaseAndInstall('esim_1GB_7D_GB_V2')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Purchase & Install eSIM</Text>
        </TouchableOpacity>
      </View>

      {orderReference && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Example 2: Direct Install</Text>
          <Text style={styles.description}>
            Install using existing order reference
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDirectInstall(orderReference)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Direct Install</Text>
          </TouchableOpacity>
        </View>
      )}

      {orderReference && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Example 3: Get QR Code</Text>
          <Text style={styles.description}>
            Download QR code for manual scanning
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleGetQRCode(orderReference)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get QR Code</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Example 4: Use Installation Screen</Text>
        <Text style={styles.description}>
          Navigate to the ready-made installation screen
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleInstallFromExistingOrder}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Open Installation Screen</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#CC0000" />
          <Text style={styles.loadingText}>Processing...</Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📚 Documentation</Text>
        <Text style={styles.infoText}>
          See ESIM_INSTALLATION_GUIDE.md for complete documentation
        </Text>
        <Text style={styles.infoText}>
          API Reference:{'\n'}
          https://docs.esim-go.com/api/v2_4/operations/esimsassignments/get/
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#CC0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

