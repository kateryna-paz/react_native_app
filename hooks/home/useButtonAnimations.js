import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export const useIconAnimation = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const iconAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -4,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: -1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    iconAnimation.start();

    return () => iconAnimation.stop();
  }, [translateY, rotate]);

  const rotateInterpolation = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-10deg", "0deg"],
  });

  return { translateY, rotateInterpolation };
};

export const useButtonBorderAnimation = (theme) => {
  const buttonBorder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const buttonAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonBorder, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonBorder, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    buttonAnimation.start();

    return () => buttonAnimation.stop();
  }, [buttonBorder]);

  const borderColorInterpolation = buttonBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [MyLightTheme.colors.blue, MyLightTheme.colors.primary],
  });

  return { borderColorInterpolation };
};
