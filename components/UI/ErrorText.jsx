import React from "react";
import { View, Text } from "react-native";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function ErrorText({ error }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      <Text
        style={{
          color: MyLightTheme.colors.red,
          textAlign: "center",
          fontFamily: FONTS.Marmelad,
          fontSize: 16,
          marginTop: 20,
        }}
      >
        Сталася помилка!
        {error}
      </Text>
    </View>
  );
}
