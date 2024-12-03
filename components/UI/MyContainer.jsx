import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";

export default function MyContainer({
  children,
  backgroundImage,
  style,
  imageStyle,
}) {
  return (
    <View style={[styles.container, style]}>
      <ImageBackground
        source={backgroundImage}
        style={[styles.image, imageStyle]}
      >
        {children}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});
