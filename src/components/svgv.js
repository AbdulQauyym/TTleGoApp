import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Header() {
  return (
    <View style={styles.container}>
      {/* Top Red Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Image
            source={{ uri: 'https://flagcdn.com/w320/us.png' }} // US flag
            style={styles.flag}
          />
          <Text style={styles.title}>United States</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      {/* Curved White Section */}
      <Svg height="80" width="100%" viewBox="0 0 1440 320" style={styles.curve}>
        <Path
          fill="#fff"
          d="M0,160L1440,320L1440,0L0,0Z"
        />
      </Svg>

      {/* Text Below Curve */}
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>Choose a data plan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#d60000', // Red color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50, // for status bar
    paddingBottom: 20,
  },
  backArrow: {
    color: '#fff',
    fontSize: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartIcon: {
    color: '#fff',
    fontSize: 24,
  },
  curve: {
    position: 'absolute',
    top: 120,
    left: 0,
  },
  textContainer: {
    marginTop: 60,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});
