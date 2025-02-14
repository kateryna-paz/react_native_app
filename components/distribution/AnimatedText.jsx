import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function AnimatedText({ text, style }) {
  return (
    <Animated.Text
      style={[styles.text, style]}
      entering={FadeIn.duration(600)
        .withInitialValues({
          opacity: 0,
          transform: [{ scale: 0.9 }, { translateY: -20 }],
        })
        .springify()}
      exiting={FadeOut.duration(500)
        .withInitialValues({
          opacity: 1,
          transform: [{ scale: 1 }, { translateY: 0 }],
        })
        .springify()}
      layout={LinearTransition.springify().mass(0.8)}
    >
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: "center",
    color: MyLightTheme.colors.black,
    fontFamily: FONTS.Kurale,
    lineHeight: 28,
    marginTop: 14,
    marginBottom: 10,
  },
});
