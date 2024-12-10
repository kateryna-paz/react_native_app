import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MyContainer from "./MyContainer";

export default function ErrorDisplay({
  colorStart,
  colorEnd,
  errorMessage,
  theme,
}) {
  return (
    <MyContainer colorStart={colorStart} colorEnd={colorEnd}>
      <View
        style={[{ backgroundColor: theme.colors.background }, styles.container]}
      >
        <Text style={{ color: theme.colors.red, fontSize: 18 }}>
          An error occurred: {errorMessage}
        </Text>
      </View>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 110,
    flex: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
});
