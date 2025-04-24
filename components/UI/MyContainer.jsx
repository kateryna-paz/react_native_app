import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function MyContainer({ children, colorStart, colorEnd, style }) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={[colorStart, colorEnd]} style={styles.gradient} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 110,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
});
