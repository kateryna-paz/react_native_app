import React from "react";
import { View, Text, StyleSheet } from "react-native";
import UserAvatar from "./UserAvatar";
import { useFontsLoaded } from "../../context/fontsContext";

export default function UserInfoSection() {
  const { loaded, error } = useFontsLoaded();

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={styles.container}>
      <UserAvatar size={96} />
      <View style={styles.info}>
        <Text
          style={{
            fontFamily: "SofiaSansBold",
            fontSize: 26,
            marginLeft: 10,
          }}
        >
          Victoria
        </Text>
        <Text
          style={{
            fontFamily: "SofiaSans",
            fontSize: 18,
          }}
        >
          victoria4527@gmail.com
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "bottom",
    marginBottom: 5,
  },
  info: {
    marginLeft: 20,
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 12,
  },
});
