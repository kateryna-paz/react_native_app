import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, Text } from "react-native";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

const useButtonBorderAnimation = () => {
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
    outputRange: [MyLightTheme.colors.green, MyLightTheme.colors.primary],
  });

  return { borderColorInterpolation };
};

export default function EnergyButton({ onPress, style }) {
  const { borderColorInterpolation } = useButtonBorderAnimation();

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
            color: MyLightTheme.colors.primary,
            fontFamily: FONTS.Marmelad,
            fontSize: 20,
          }}
        >
          Розрахувати енергію
        </Animated.Text>
        <Text style={{ fontSize: 22, color: MyLightTheme.colors.primary }}>
          ⚡
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
