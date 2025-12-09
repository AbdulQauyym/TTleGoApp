import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Svgwave() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Add your content here (flag, logo, text, etc.) */}

        {/* Curved bottom (parabola shape) */}
        <Svg
          height="80"
          width="100%"
          viewBox="0 0 1440 320"
          style={styles.curve}
        >
          <Path
            fill="#CC0000" // same color as header
            d="M0,160 C480,0 0,60 0,0 L1440,320 L0,320 Z"
          />
        </Svg>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#CC0000",
    height: 200,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  curve: {
    position: "absolute",
    bottom: 0,
  },
});
