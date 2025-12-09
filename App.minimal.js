import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <SplashScreen navigation={null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC0000',
  },
});






