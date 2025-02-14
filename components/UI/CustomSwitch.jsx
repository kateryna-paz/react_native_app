import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MyLightTheme } from "../../assets/theme/global";

export default function CustomSwitch({
  value,
  onPress,
  style,
  duration = 400,
  trackColors = {
    on: MyLightTheme.colors.primary,
    off: MyLightTheme.colors.primaryLight,
  },
}) {
  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      value.value,
      [0, 1],
      [trackColors.off, trackColors.on]
    );
    const colorValue = withTiming(color, { duration });

    return {
      backgroundColor: colorValue,
      borderRadius: height.value ? height.value / 2 : 30,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      Number(value.value),
      [0, 1],
      [0, width.value - height.value]
    );
    const translateValue = withTiming(moveValue, { duration });

    return {
      transform: [{ translateX: translateValue }],
      borderRadius: height.value ? height.value / 2 : 30,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
          width.value = e.nativeEvent.layout.width;
        }}
        style={[styles.track, style, trackAnimatedStyle]}
      >
        <Animated.View
          style={[styles.thumb, thumbAnimatedStyle]}
        ></Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    alignItems: "flex-start",
    width: 80,
    height: 30,
    padding: 0,
    shadowColor: MyLightTheme.colors.black,
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  thumb: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: MyLightTheme.colors.white,
    shadowColor: MyLightTheme.colors.black,
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
});
