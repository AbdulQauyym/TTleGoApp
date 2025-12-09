import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function NetworkSpeedScreen({navigation}) {
  const [isTesting, setIsTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState(null);
  const [ping, setPing] = useState(null);
  const [progress] = useState(new Animated.Value(0));

  const simulateSpeedTest = () => {
    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);

    // Reset progress
    progress.setValue(0);

    // Animate progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start();

    // Simulate speed test
    setTimeout(() => {
      // Simulate download speed (Mbps)
      const download = (Math.random() * 50 + 10).toFixed(2);
      setDownloadSpeed(download);

      setTimeout(() => {
        // Simulate upload speed (Mbps)
        const upload = (Math.random() * 20 + 5).toFixed(2);
        setUploadSpeed(upload);

        setTimeout(() => {
          // Simulate ping (ms)
          const pingValue = Math.floor(Math.random() * 50 + 10);
          setPing(pingValue);
          setIsTesting(false);
        }, 1000);
      }, 1000);
    }, 3000);
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

          {!isTesting && !downloadSpeed && (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={simulateSpeedTest}
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle" size={32} color="#fff" />
              <Text style={styles.startButtonText}>Start Speed Test</Text>
            </TouchableOpacity>
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
              {uploadSpeed && (
                <View style={styles.speedItem}>
                  <View style={styles.speedHeader}>
                    <Ionicons name="upload-outline" size={24} color="#000" />
                    <Text style={styles.speedLabel}>Upload Speed</Text>
                  </View>
                  <View style={styles.speedValueContainer}>
                    <Text style={styles.speedValue}>{uploadSpeed}</Text>
                    <Text style={styles.speedUnit}>Mbps</Text>
                  </View>
                  <View style={[styles.qualityBadge, { backgroundColor: uploadQuality.color + '20' }]}>
                    <Text style={[styles.qualityText, { color: uploadQuality.color }]}>
                      {uploadQuality.label}
                    </Text>
                  </View>
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
              <TouchableOpacity 
                style={styles.testAgainButton}
                onPress={simulateSpeedTest}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={20} color="#000" />
                <Text style={styles.testAgainText}>Test Again</Text>
              </TouchableOpacity>
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
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
  testAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  testAgainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
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
});

