import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, Text, View } from "react-native";

const useIconAnimation = () => {
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

const useButtonBorderAnimation = (theme) => {
  const buttonBorder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const buttonAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonBorder, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(buttonBorder, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    buttonAnimation.start();

    return () => buttonAnimation.stop();
  }, [buttonBorder]);

  const borderColorInterpolation = buttonBorder.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.green, theme.colors.primary],
  });

  return { borderColorInterpolation };
};

export default function EnergyButton({ onPress, theme, style }) {
  const { translateY, rotateInterpolation } = useIconAnimation();
  const { borderColorInterpolation } = useButtonBorderAnimation(theme);

  return (
    <Animated.View
      style={[
        style,
        {
          borderWidth: 3,
          borderColor: borderColorInterpolation,
        },
      ]}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingLeft: 10,
        }}
        onPress={onPress}
      >
        <Animated.Text
          style={{
            color: theme.colors.primary,
            fontFamily: "Marmelad",
            fontSize: 20,
          }}
        >
          Розрахувати енергію
        </Animated.Text>
        <Animated.View
          style={{
            transform: [
              { translateY: translateY },
              { rotate: rotateInterpolation },
            ],
          }}
        >
          <Text style={{ fontSize: 22, color: theme.colors.primary }}>⚡</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}
