import { Pressable, StyleSheet, Text } from "react-native";
import { icon } from "../constants/icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

function TabBarButton({ onPress, onLongPress, label, isFocused, routeName }) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedText = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });

  const animatedIcon = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.3]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return { transform: [{ scale: scaleValue }], top };
  });
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabitem}
    >
      <Animated.View style={animatedIcon}>
        {icon[routeName]({
          color: isFocused ? "white" : "#222",
          size: 26,
        })}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color: isFocused ? "white" : "grey",
            fontSize: 11,
            fontFamily: "SofiaSans",
          },
          animatedText,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabitem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    fontFamily: "RobotoSlab",
  },
});

export default TabBarButton;
