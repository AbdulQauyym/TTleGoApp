// StartupScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function StartupScreen() {
  const [width, setWidth] = useState(375);
  
  useEffect(() => {
    // Use safe dimensions utility
    const safeDimensions = require('../utils/dimensions').getSafeWindowDimensions();
    setWidth(safeDimensions.width);
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      try {
        if (window && typeof window.width === 'number') {
          setWidth(window.width);
        }
      } catch (e) {
        setWidth(375);
      }
    });
    
    return () => {
      try {
        subscription?.remove();
      } catch (e) {}
    };
  }, []);
  return (
    <View style={styles.container}>
      {/* Red Background with Topographic Pattern */}
      <View style={styles.redBackground}>
        {/* You can replace this with an ImageBackground if you have a topographic image */}
      </View>

      {/* SVG Wave */}
      <Svg
        height="100"
        width={width}
        viewBox={`0 0 ${width} 100`}
        style={styles.wave}
      >
        <Path
          d={`M0,30 C${width / 4},60 ${width * 3 / 4},0 ${width},30 L${width},100 L0,100 Z`}
          fill="#fff"
        />
      </Svg>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Lorem ipsum dolor sit amet consectetur.</Text>
        <Text style={styles.subtitle}>Lorem id sit</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  redBackground: {
    height: '60%',
    backgroundColor: '#d00',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  wave: {
    position: 'absolute',
    top: '55%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
