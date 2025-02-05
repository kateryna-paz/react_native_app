import React from "react";
import { ActivityIndicator } from "react-native-paper";
import MyContainer from "./MyContainer";
import Header from "./Header";
import { MyLightTheme } from "../../assets/theme/global";

export default function LoadingScreen({
  colorStart = MyLightTheme.colors.primaryLight,
  colorEnd = MyLightTheme.colors.secondaryLight,
  indicatorColor = MyLightTheme.colors.primary,
  title,
}) {
  return (
    <MyContainer colorStart={colorStart} colorEnd={colorEnd}>
      {title && <Header title={title} />}
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        color={indicatorColor}
      />
    </MyContainer>
  );
}
