import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { scaleSize, getSafeWindowDimensions } from '../utils/dimensions';

// Try to load the image with error handling - try multiple possible filenames
let firstPageImage = null;
try {
  // Try different possible filenames (case variations)
  try {
    firstPageImage = require('../assets/FIrstPage.jpeg');
  } catch (e1) {
    try {
      firstPageImage = require('../assets/FirstPage.jpeg');
    } catch (e2) {
      try {
        firstPageImage = require('../assets/firstPage.png');
      } catch (e3) {
        firstPageImage = null;
      }
    }
  }
} catch (error) {
  console.error('Error loading splash screen image:', error);
  firstPageImage = null;
}

export default function SplashScreen({ navigation }) {
  const [progress, setProgress] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 375, height: 667 });

  useEffect(() => {
    setDimensions(getSafeWindowDimensions());
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      if (window && typeof window.width === 'number' && typeof window.height === 'number') {
        setDimensions({
          width: window.width,
          height: window.height
        });
      }
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const duration = 3000; // 7 seconds
    const interval = 50; // Update every 50ms for smooth animation
    const steps = duration / interval;
    let currentStep = 0;
    let progressInterval = null;
    let timer = null;

    progressInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
      }
    }, interval);

    timer = setTimeout(() => {
      try {
        if (navigation) {
          if (navigation.replace) {
            navigation.replace('WelcomeScreen');
          } else if (navigation.navigate) {
            navigation.navigate('WelcomeScreen');
          }
        }
      } catch (error) {
        console.error('SplashScreen navigation error:', error);
      }
    }, duration);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [navigation]);

  // Responsive circle parameters
  const size = scaleSize(80);
  const strokeWidth = scaleSize(6);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const progressBottom = scaleSize(80);

  try {
    return (
      <View style={styles.container}>
        {firstPageImage && !imageError ? (
          <Image 
            source={firstPageImage} 
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.error('SplashScreen image error:', error);
              setImageError(true);
            }}
            onLoad={() => {
              console.log('Image loaded successfully');
            }}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Loading App...</Text>
          </View>
        )}
        
        {/* Circular Progress Bar */}
        <View style={[styles.progressContainer, { bottom: progressBottom }]}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E0E0E0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress Circle */}
            <G rotation={-90} originX={size / 2} originY={size / 2}>
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#FFFFFF"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          {/* Percentage Text */}
          <View style={[styles.percentageContainer, { width: size, height: size }]}>
            <Text style={[styles.percentageText, { fontSize: scaleSize(18) }]}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </View>
    );
  } catch (error) {
    console.error('SplashScreen render error:', error);
    return (
      <View style={[styles.container, { backgroundColor: '#CC0000', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC0000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  progressContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CC0000',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
