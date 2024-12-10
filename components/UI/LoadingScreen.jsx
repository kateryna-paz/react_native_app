import React from "react";
import { ActivityIndicator } from "react-native-paper";
import MyContainer from "./MyContainer";

export default function LoadingScreen({
  colorStart,
  colorEnd,
  indicatorColor,
}) {
  return (
    <MyContainer colorStart={colorStart} colorEnd={colorEnd}>
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        color={indicatorColor}
      />
    </MyContainer>
  );
}
