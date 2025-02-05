import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}> {title} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: MyLightTheme.colors.transparent,
    paddingTop: 20,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.SofiaSansBold,
    color: MyLightTheme.colors.black,
  },
});
