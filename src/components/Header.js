import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { scaleSize, widthPercentage, heightPercentage, getSafeWindowDimensions } from '../utils/dimensions';

const cercle = require("../assets/Ellipse14.png");
const cercle2 = require("../assets/E15.png");

export default function HeaderScreen() {
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

  // Responsive dimensions
  const SCREEN_WIDTH = dimensions.width;
  const HEADER_HEIGHT = scaleSize(300);
  const IMAGE_ROW_HEIGHT = scaleSize(200);
  const RIGHT_IMAGE_WIDTH = scaleSize(200);
  const RIGHT_IMAGE_HEIGHT = scaleSize(300);
  const LEFT_IMAGE_SIZE = scaleSize(200);
  const CURVE_HEIGHT = scaleSize(190);
  const RIGHT_IMAGE_MARGIN_RIGHT = widthPercentage(29); // ~110px on 375px screen
  const RIGHT_IMAGE_MARGIN_TOP = heightPercentage(15); // ~100px on 667px screen
  const CURVE_TOP = scaleSize(150);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { height: HEADER_HEIGHT }]}>
        <View style={[styles.imageRow, { height: IMAGE_ROW_HEIGHT }]}>    
          <Image 
            source={cercle} 
            style={[
              styles.rightImage, 
              { 
                width: RIGHT_IMAGE_WIDTH, 
                height: RIGHT_IMAGE_HEIGHT,
                marginRight: RIGHT_IMAGE_MARGIN_RIGHT,
                marginTop: RIGHT_IMAGE_MARGIN_TOP
              }
            ]} 
          />
          <Image 
            source={cercle2} 
            style={[
              styles.leftImage, 
              { 
                width: LEFT_IMAGE_SIZE, 
                height: LEFT_IMAGE_SIZE
              }
            ]} 
          />   
        </View>
         {/* Curved White Shape */}
         <Svg 
           height={CURVE_HEIGHT} 
           width="100%" 
           viewBox="0 0 1440 320" 
           style={[styles.curve, { top: CURVE_TOP, height: CURVE_HEIGHT }]}
         >
          <Path fill="#CC0000" d="M0,200 Q720,-200 1440,200 L1440,0 L0,0 Z" />
        </Svg>   
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: "transparent",
    position: 'relative',
    overflow: 'hidden',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#CC0000",
    overflow: 'hidden',
    zIndex: 2,
    position: 'relative',
  },
  rightImage: {
    transform: [{ rotate: '-45deg' }],
  },
  leftImage: {
    transform: [{ rotate: '-45deg' }],
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0,
  },
  curve: {
    marginTop:-5,
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
});