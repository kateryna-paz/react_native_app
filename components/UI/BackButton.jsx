import React from "react";
import { useNavigation } from "expo-router";
import { FAB } from "react-native-paper";
import { MyLightTheme } from "../../assets/theme/global";

export default function BackButton({ stylesBtn, onPress, iconColor, size }) {
  const navigator = useNavigation();

  const handlePress = () => {
    if (onPress) onPress();
    else navigator.goBack();
  };
  return (
    <FAB
      onPress={handlePress}
      icon={"arrow-left"}
      color={iconColor || MyLightTheme.colors.black}
      style={stylesBtn}
      customSize={50 || size}
    />
  );
}
