import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function WaveMaskedImage() {
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
      {/* Red Topographic Background */}
      <ImageBackground
        source={require('../assets/a.png')} // Replace with your image
        style={styles.topBackground}
        resizeMode="cover"
      >
        {/* Masked Image inside wave */}
        <View style={styles.imageWrapper}>
       
        </View>

        {/* SVG Wave */}
        <Svg height={100} width={width} style={styles.wave}>
          <Path
            d={`M0,40 C${width / 4},80 ${width * 3 / 4},0 ${width},40 L${width},100 L0,100 Z`}
            fill="#fff"
          />
        </Svg>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBackground: {
    height: 300,
    backgroundColor: '#d00',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 200,
    height: 100,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
  },
});
