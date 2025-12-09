import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import HeaderScreen from './Header';

export default function CartScreen({navigation}) {
  const sim = require("../assets/sim.png");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <Image source={sim} style={styles.image} />
        <Text style={styles.message}>You have no item in your cart</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate('Home', { screen: 'HomeMain' });
            } else {
              navigation.navigate('HomeMain');
            }
          }}
        >
          <Text style={styles.buttonText}>Shop eSIM Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    height: "40%",
    position: 'relative',
    overflow: 'hidden',
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
    width: '100%',
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  imageRow: {
  flexDirection: 'row',
  alignItems: 'center',
    justifyContent: 'space-between',
    height: 200,
     backgroundColor: "#CC0000",
    paddingVertical: 60,
    overflow: 'hidden',
    zIndex: 0,
  paddingHorizontal: 0,
  position: 'relative',
   resizeMode: 'contain',
},
rightImage: {
  width: 200,
  height: 300,
 marginRight: 150,
    marginTop: 100,
    transform: [{ rotate: '-95deg' }],
},
leftImage: {
  width: 200,
  height: 200,
    transform: [{ translateX: -10 }],
  marginLeft: 100,
    marginTop: 100,
    overflow: 'hidden',
  resizeMode: 'contain',
    zIndex: 0,
},
  curve: {
    position: 'absolute',
    top: 150,
    left: 0,
    zIndex: 0,
    overflow: 'hidden',
       resizeMode: 'contain',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 0,
  },
  image: {
    width: 200,
    height: 150,
    marginBottom: 20,
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
});