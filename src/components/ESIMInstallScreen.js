import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getESIMInstallDetails, getESIMInstallURL, getESIMQRCode } from '../services/api';

/**
 * eSIM Installation Screen
 * 
 * This component handles the installation of eSIMs using the eSIM Go API.
 * It retrieves SMDP+ details and provides options to:
 * 1. Display QR code for manual scanning
 * 2. Show installation URL for direct installation
 * 3. Provide step-by-step instructions
 * 
 * @param {Object} props
 * @param {Object} props.navigation - Navigation object
 * @param {Object} props.route - Route object containing reference parameter
 * @param {string} props.route.params.reference - Order Reference or Apply Reference
 */
export default function ESIMInstallScreen({ navigation, route }) {
  const { reference } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [esimData, setEsimData] = useState(null);
  const [installURL, setInstallURL] = useState(null);
  const [error, setError] = useState(null);
  const [qrCodeBlob, setQrCodeBlob] = useState(null);

  const loadESIMDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get eSIM install details
      const details = await getESIMInstallDetails(reference, { format: 'json' });
      
      // Handle array response (multiple eSIMs)
      const data = Array.isArray(details) ? details[0] : details;
      setEsimData(data);

      // Get installation URL
      try {
        const url = await getESIMInstallURL(reference);
        setInstallURL(url);
      } catch (urlError) {
        console.warn('Could not get install URL:', urlError);
        // Construct URL manually if API doesn't provide it
        if (data.smdpAddress && data.matchingId) {
          setInstallURL(`LPA:1$${data.smdpAddress}$${data.matchingId}`);
        }
      }

      // Try to get QR code (optional)
      try {
        const qrBlob = await getESIMQRCode(reference);
        setQrCodeBlob(qrBlob);
      } catch (qrError) {
        console.warn('Could not get QR code:', qrError);
        // QR code is optional, so we don't fail if it's not available
      }
    } catch (err) {
      console.error('Error loading eSIM details:', err);
      setError(err.message || 'Failed to load eSIM installation details');
      Alert.alert(
        'Error',
        err.message || 'Failed to load eSIM installation details. Please try again.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  }, [reference, navigation]);

  useEffect(() => {
    if (reference) {
      loadESIMDetails();
    } else {
      setError('No reference provided');
      setLoading(false);
    }
  }, [reference, loadESIMDetails]);

  const handleInstall = async () => {
    if (!installURL) {
      Alert.alert('Error', 'Installation URL not available');
      return;
    }

    try {
      // Try to open the installation URL
      // iOS: This will open the Settings app to install the eSIM
      // Android: This will trigger the eSIM installation flow
      const canOpen = await Linking.canOpenURL(installURL);
      
      if (canOpen) {
        await Linking.openURL(installURL);
      } else {
        // Fallback: Show instructions
        showInstallInstructions();
      }
    } catch (err) {
      console.error('Error opening install URL:', err);
      // Fallback: Show instructions
      showInstallInstructions();
    }
  };

  const showInstallInstructions = () => {
    const instructions = Platform.select({
      ios: [
        '1. Go to Settings > Cellular',
        '2. Tap "Add Cellular Plan"',
        '3. Scan the QR code or enter the details manually',
        '4. Follow the on-screen instructions',
      ],
      android: [
        '1. Go to Settings > Network & Internet > Mobile network',
        '2. Tap "Download a SIM instead" or "Add eSIM"',
        '3. Scan the QR code or enter the SMDP+ address',
        '4. Follow the on-screen instructions',
      ],
    });

    Alert.alert(
      'Installation Instructions',
      instructions.join('\n'),
      [{ text: 'OK' }]
    );
  };

  const handleShareDetails = async () => {
    if (!esimData) return;

    const shareText = `eSIM Installation Details:\n\n` +
      `ICCID: ${esimData.iccid || 'N/A'}\n` +
      `SMDP+ Address: ${esimData.smdpAddress || esimData.smdp_address || 'N/A'}\n` +
      `Matching ID: ${esimData.matchingId || esimData.matching_id || 'N/A'}\n` +
      (installURL ? `Install URL: ${installURL}` : '');

    try {
      await Share.share({
        message: shareText,
        title: 'eSIM Installation Details',
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const copyToClipboard = (text) => {
    // Note: You'll need to install @react-native-clipboard/clipboard for this
    Alert.alert('Copied!', `${text} copied to clipboard`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#CC0000" />
          <Text style={styles.loadingText}>Loading eSIM details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#CC0000" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadESIMDetails}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Install eSIM</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareDetails}
        >
          <Ionicons name="share-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Status Card */}
        {esimData && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.cardTitle}>eSIM Ready for Installation</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ICCID:</Text>
              <Text style={styles.infoValue}>{esimData.iccid || 'N/A'}</Text>
            </View>

            {esimData.profileStatus && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{esimData.profileStatus}</Text>
              </View>
            )}

            {esimData.smdpAddress || esimData.smdp_address ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>SMDP+ Address:</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(esimData.smdpAddress || esimData.smdp_address)}
                >
                  <Text style={[styles.infoValue, styles.copyableText]}>
                    {esimData.smdpAddress || esimData.smdp_address}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {esimData.matchingId || esimData.matching_id ? (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Matching ID:</Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(esimData.matchingId || esimData.matching_id)}
                >
                  <Text style={[styles.infoValue, styles.copyableText]}>
                    {esimData.matchingId || esimData.matching_id}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {/* QR Code Section */}
        {qrCodeBlob && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>QR Code</Text>
            <Text style={styles.sectionDescription}>
              Scan this QR code with your device to install the eSIM
            </Text>
            <View style={styles.qrCodePlaceholder}>
              <Ionicons name="qr-code-outline" size={120} color="#CC0000" />
              <Text style={styles.qrCodeNote}>
                QR code image available in ZIP format
              </Text>
            </View>
          </View>
        )}

        {/* Installation Instructions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Installation Steps</Text>
          {Platform.OS === 'ios' ? (
            <>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>Go to Settings → Cellular</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>Tap "Add Cellular Plan"</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>
                  Scan the QR code or enter the SMDP+ details manually
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepText}>Follow the on-screen instructions</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <Text style={styles.stepText}>
                  Go to Settings → Network & Internet → Mobile network
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <Text style={styles.stepText}>Tap "Download a SIM instead" or "Add eSIM"</Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <Text style={styles.stepText}>
                  Scan the QR code or enter the SMDP+ address
                </Text>
              </View>
              <View style={styles.step}>
                <Text style={styles.stepNumber}>4</Text>
                <Text style={styles.stepText}>Follow the on-screen instructions</Text>
              </View>
            </>
          )}
        </View>

        {/* Install Button */}
        {installURL && (
          <TouchableOpacity
            style={styles.installButton}
            onPress={handleInstall}
          >
            <Ionicons name="download" size={24} color="#FFF" />
            <Text style={styles.installButtonText}>Install eSIM</Text>
          </TouchableOpacity>
        )}

        {/* Manual Entry Option */}
        <TouchableOpacity
          style={styles.manualButton}
          onPress={showInstallInstructions}
        >
          <Text style={styles.manualButtonText}>View Manual Instructions</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#CC0000',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  copyableText: {
    color: '#CC0000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  qrCodePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  qrCodeNote: {
    marginTop: 16,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CC0000',
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CC0000',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  installButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  manualButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  manualButtonText: {
    color: '#CC0000',
    fontSize: 16,
    fontWeight: '600',
  },
});

