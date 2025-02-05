import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { FONTS, MyLightTheme } from "../assets/theme/global";

export default function LocationsButtons({
  handleFetchLocation,
  handleUseMap,
}) {
  return (
    <View>
      <Button
        mode="outlined"
        onPress={handleFetchLocation}
        contentStyle={styles.buttonContent}
        textColor={MyLightTheme.colors.black}
        style={styles.outlinedButton}
      >
        <Text style={styles.buttonText}>Скористатись геолокацією{"  "}</Text>
        <FontAwesome
          name="map-marker"
          size={21}
          color={MyLightTheme.colors.black}
        />
      </Button>
      <Button
        mode="contained"
        onPress={handleUseMap}
        contentStyle={styles.buttonContent}
        buttonColor={MyLightTheme.colors.warning}
        textColor={MyLightTheme.colors.white}
        style={styles.containedButton}
      >
        <Text style={styles.buttonText}>Показати на карті{"  "}</Text>
        <FontAwesome name="map-o" size={20} color={MyLightTheme.colors.white} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: "row-reverse",
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: FONTS.Kurale,
    fontSize: 18,
    lineHeight: 28,
  },
  outlinedButton: {
    marginVertical: 6,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: MyLightTheme.colors.warning,
    height: 50,
  },
  containedButton: {
    marginVertical: 6,
    marginHorizontal: 10,
    paddingTop: 4,
    height: 50,
  },
});
