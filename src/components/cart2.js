import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
const cercle = require("../assets/Ellipse14.png");
const cercle2 = require("../assets/E15.png");

export default function CartScreen() {
  const sim = require("../assets/sim.png");
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
      {/* Header */}
      <View style={styles.header}>
        <ImageBackground style={styles.imageRow} source={null}>
          {/* Circle images positioned within the header */}
          <Image source={cercle} style={styles.rightImage} />
          <Image source={cercle2} style={styles.leftImage} />
        </ImageBackground>

        {/* SVG Wave - concave shape dipping in center */}
        <Svg 
          height="80" 
          width={width} 
          viewBox={`0 0 ${width} 80`}
          style={styles.curve}
          preserveAspectRatio="none"
        >
          <Path 
            fill="#fff" 
            d={`M0,0 Q${width * 0.25},40 ${width * 0.5},20 T${width},0 L${width},80 L0,80 Z`}
          />
        </Svg>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Image source={sim} style={styles.image} />
        <Text style={styles.message}>You have no item in your cart</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Shop eSIM Now</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 300,
    backgroundColor: "#CC0000",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingVertical: 0,
    alignItems: "center",
    overflow: 'hidden',
    position: 'relative',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 300,
    width: '100%',
    backgroundColor: "#CC0000",
    paddingVertical: 0,
    paddingHorizontal: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  rightImage: {
    width: 200,
    height: 300,
    position: 'absolute',
    right: -50,
    top: 50,
    transform: [{ rotate: '-95deg' }],
    opacity: 0.3,
  },
  leftImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    left: -30,
    top: 80,
    transform: [{ translateX: -10 }],
    opacity: 0.3,
  },
  curve: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  content: {
    marginTop: -1, // Overlap to hide gap
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 20,
    marginTop: 100,
  },
  message: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#CC0000',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});