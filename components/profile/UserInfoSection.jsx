import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function UserInfoSection({ user }) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text
          style={{
            fontFamily: FONTS.SofiaSansBold,
            fontSize: 34,
            color: MyLightTheme.colors.primary,
          }}
        >
          {user ? user?.name : "Guest"}
        </Text>
        <Text
          style={{
            fontFamily: FONTS.Marmelad,
            fontSize: 18,
            color: MyLightTheme.colors.primaryDark,
          }}
        >
          {user ? user?.email : "email@gmail.com"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    marginTop: 28,
    borderRadius: 8,
  },
  info: {
    marginBottom: 14,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
});
