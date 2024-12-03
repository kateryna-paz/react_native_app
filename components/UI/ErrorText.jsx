import React from "react";
import { View, Text } from "react-native";

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
          color: "red",
          textAlign: "center",
          fontFamily: "Marmelad",
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
