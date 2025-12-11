import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Animated, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function NetworkSpeedScreen({navigation}) {
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [progress] = useState(new Animated.Value(0));
  const [testStatus, setTestStatus] = useState('');

  // Measure ping latency
  const measurePing = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      // Fallback ping test
      const endTime = Date.now();
      return endTime - startTime;
    }
  };

  // Measure download speed
  const measureDownloadSpeed = async () => {
    setTestStatus('Testing download speed...');
    const testUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    const startTime = Date.now();
    let downloadedBytes = 0;

    try {
      const response = await fetch(testUrl, {
        cache: 'no-cache',
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const reader = response.body.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        downloadedBytes += value.length;
      }
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // Convert to seconds
      const bitsLoaded = downloadedBytes * 8;
      const mbps = (bitsLoaded / duration / 1000000).toFixed(2); // Convert to Mbps
      
      return parseFloat(mbps);
    } catch (error) {
      console.error('Download speed test error:', error);
      // Fallback: use a larger test file
      try {
        const startTime2 = Date.now();
        const response2 = await fetch('https://jsonplaceholder.typicode.com/posts', {
          cache: 'no-cache',
        });
        const data = await response2.text();
        const endTime2 = Date.now();
        const duration2 = (endTime2 - startTime2) / 1000;
        const bitsLoaded2 = data.length * 8;
        const mbps2 = (bitsLoaded2 / duration2 / 1000000).toFixed(2);
        return parseFloat(mbps2);
      } catch (err) {
        return null;
      }
    }
  };

  // Measure upload speed
  const measureUploadSpeed = async () => {
    setTestStatus('Testing upload speed...');
    const testData = new Array(5000).fill('0').join(''); // ~5KB test data (smaller for better reliability)
    const startTime = Date.now();

    // Try multiple endpoints for better reliability
    const endpoints = [
      'https://jsonplaceholder.typicode.com/posts',
      'https://httpbin.org/post',
      'https://postman-echo.com/post',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            test: testData,
            timestamp: Date.now()
          }),
          cache: 'no-cache',
        });

        if (response.ok || response.status === 200 || response.status === 201) {
          const endTime = Date.now();
          const duration = (endTime - startTime) / 1000; // Convert to seconds
          if (duration > 0) {
            const bitsUploaded = testData.length * 8;
            const mbps = (bitsUploaded / duration / 1000000).toFixed(2); // Convert to Mbps
            return parseFloat(mbps);
          }
        }
      } catch (error) {
        // Silently try next endpoint
        continue;
      }
    }

    // If all endpoints fail, return null (upload test will be skipped)
    return null;
  };

  const runSpeedTest = async () => {
    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setTestStatus('Starting speed test...');

    // Reset progress
    progress.setValue(0);

    // Animate progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 15000, // 15 seconds for full test
      useNativeDriver: false,
    }).start();

    try {
      // Step 1: Measure Ping
      setTestStatus('Measuring latency...');
      const pingValue = await measurePing();
      setPing(pingValue);

      // Step 2: Measure Download Speed
      const download = await measureDownloadSpeed();
      if (download !== null) {
        setDownloadSpeed(download.toFixed(2));
      }

      // Step 3: Measure Upload Speed (optional - may fail silently)
      try {
        const upload = await measureUploadSpeed();
        if (upload !== null && upload > 0) {
          setUploadSpeed(upload.toFixed(2));
        } else {
          // Upload test failed, but don't show error - just skip it
          setUploadSpeed(null);
        }
      } catch (uploadError) {
        // Silently handle upload test failure
        setUploadSpeed(null);
      }

      setTestStatus('Speed test completed!');
    } catch (error) {
      // Only log critical errors, don't show to user
      setTestStatus('Speed test completed with partial results.');
    } finally {
      setIsTesting(false);
    }
  };

  const openFastCom = () => {
    Linking.openURL('https://fast.com').catch(err => {
      console.error('Failed to open fast.com:', err);
    });
  };

  const getSpeedQuality = (speed) => {
    if (!speed) return { label: 'N/A', color: '#666' };
    const speedNum = parseFloat(speed);
    if (speedNum >= 25) return { label: 'Excellent', color: '#4CAF50' };
    if (speedNum >= 10) return { label: 'Good', color: '#8BC34A' };
    if (speedNum >= 5) return { label: 'Fair', color: '#FFC107' };
    return { label: 'Poor', color: '#F44336' };
  };

  const downloadQuality = getSpeedQuality(downloadSpeed);
  const uploadQuality = getSpeedQuality(uploadSpeed);

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
          <Text style={styles.headerTitle}>Network and Speed</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Introduction Section */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>Internet Speed Test</Text>
          <Text style={styles.introText}>
            Test your current internet connection speed to check download, upload speeds, and ping latency.
          </Text>
        </View>

        {/* Speed Test Card */}
        <View style={styles.testCard}>
          <View style={styles.testIconContainer}>
            <Ionicons name="speedometer-outline" size={48} color="#000" />
          </View>
          
          {isTesting && (
            <View style={styles.progressContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.progressText}>Testing your connection...</Text>
            </View>
          )}

          {isTesting && (
            <Text style={styles.testStatusText}>{testStatus}</Text>
          )}

          {!isTesting && !downloadSpeed && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={runSpeedTest}
                activeOpacity={0.8}
              >
                <Ionicons name="play-circle" size={32} color="#fff" />
                <Text style={styles.startButtonText}>Start Speed Test</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.fastComButton}
                onPress={openFastCom}
                activeOpacity={0.8}
              >
                <Ionicons name="globe-outline" size={20} color="#CC0000" />
                <Text style={styles.fastComButtonText}>Test on Fast.com</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Results */}
          {(downloadSpeed || uploadSpeed || ping !== null) && !isTesting && (
            <View style={styles.resultsContainer}>
              {/* Download Speed */}
              {downloadSpeed && (
                <View style={styles.speedItem}>
                  <View style={styles.speedHeader}>
                    <Ionicons name="download-outline" size={24} color="#000" />
                    <Text style={styles.speedLabel}>Download Speed</Text>
                  </View>
                  <View style={styles.speedValueContainer}>
                    <Text style={styles.speedValue}>{downloadSpeed}</Text>
                    <Text style={styles.speedUnit}>Mbps</Text>
                  </View>
                  <View style={[styles.qualityBadge, { backgroundColor: downloadQuality.color + '20' }]}>
                    <Text style={[styles.qualityText, { color: downloadQuality.color }]}>
                      {downloadQuality.label}
                    </Text>
                  </View>
                </View>
              )}

              {/* Upload Speed */}
              {uploadSpeed !== null && (
                <View style={styles.speedItem}>
                  <View style={styles.speedHeader}>
                    <Ionicons name="upload-outline" size={24} color="#000" />
                    <Text style={styles.speedLabel}>Upload Speed</Text>
                  </View>
                  {uploadSpeed ? (
                    <>
                      <View style={styles.speedValueContainer}>
                        <Text style={styles.speedValue}>{uploadSpeed}</Text>
                        <Text style={styles.speedUnit}>Mbps</Text>
                      </View>
                      <View style={[styles.qualityBadge, { backgroundColor: uploadQuality.color + '20' }]}>
                        <Text style={[styles.qualityText, { color: uploadQuality.color }]}>
                          {uploadQuality.label}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.unavailableText}>Upload test unavailable</Text>
                  )}
                </View>
              )}

              {/* Ping */}
              {ping !== null && (
                <View style={styles.speedItem}>
                  <View style={styles.speedHeader}>
                    <Ionicons name="time-outline" size={24} color="#000" />
                    <Text style={styles.speedLabel}>Ping (Latency)</Text>
                  </View>
                  <View style={styles.speedValueContainer}>
                    <Text style={styles.speedValue}>{ping}</Text>
                    <Text style={styles.speedUnit}>ms</Text>
                  </View>
                  <View style={[styles.qualityBadge, { backgroundColor: ping < 50 ? '#4CAF5020' : '#FFC10720' }]}>
                    <Text style={[styles.qualityText, { color: ping < 50 ? '#4CAF50' : '#FFC107' }]}>
                      {ping < 50 ? 'Excellent' : ping < 100 ? 'Good' : 'Fair'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Test Again Button */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.testAgainButton}
                  onPress={runSpeedTest}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={20} color="#000" />
                  <Text style={styles.testAgainText}>Test Again</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.fastComButtonSmall}
                  onPress={openFastCom}
                  activeOpacity={0.8}
                >
                  <Ionicons name="globe-outline" size={18} color="#CC0000" />
                  <Text style={styles.fastComButtonTextSmall}>Fast.com</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={24} color="#000" />
            <Text style={styles.tipsTitle}>Tips for Better Speed</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipText}>• Move closer to your Wi-Fi router</Text>
            <Text style={styles.tipText}>• Close unnecessary apps and browser tabs</Text>
            <Text style={styles.tipText}>• Restart your router if speeds are consistently low</Text>
            <Text style={styles.tipText}>• Check for network congestion during peak hours</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    padding: 16,
    paddingTop: 20,
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
    color: '#666',
    lineHeight: 20,
    fontFamily: 'Poppins',
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testIconContainer: {
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins',
  },
  testStatusText: {
    marginTop: 12,
    fontSize: 14,
    color: '#CC0000',
    fontWeight: '600',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CC0000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    fontFamily: 'Poppins',
  },
  fastComButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CC0000',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  fastComButtonText: {
    color: '#CC0000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  resultsContainer: {
    width: '100%',
    marginTop: 20,
  },
  speedItem: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  speedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  speedLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  speedValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  speedValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Poppins',
  },
  speedUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  qualityBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  testAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  testAgainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  fastComButtonSmall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#CC0000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  fastComButtonTextSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CC0000',
    marginLeft: 6,
    fontFamily: 'Poppins',
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
    fontFamily: 'Poppins',
  },
  tipItem: {
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 4,
    fontFamily: 'Poppins',
  },
  unavailableText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
    fontFamily: 'Poppins',
  },
});

