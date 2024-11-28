import React from "react";
import { useRouter } from "expo-router";
import { FAB } from "react-native-paper";

export default function BackButton({ stylesBtn, onPress, iconColor }) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) onPress();
    else router.back();
  };
  return (
    <FAB
      onPress={handlePress}
      icon={"arrow-left"}
      color={iconColor || "black"}
      style={stylesBtn}
      customSize={46}
    />
  );
}
