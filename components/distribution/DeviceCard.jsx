import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { importances } from "../../constants/importanceDevices";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import { useSharedValue } from "react-native-reanimated";
import CustomSwitch from "../UI/CustomSwitch";

export default function DeviceCard({ data }) {
  const [deviceData] = useState({
    name: data.name || "",
    power: data.power || 0,
    importanceId:
      importances.find((imp) => imp.type.toLowerCase() === data.importance)
        .id || null,
  });

  const isOn = useSharedValue(false);

  const handlePress = () => {
    isOn.value = !isOn.value;
  };

  return (
    <View
      style={[styles.card, { backgroundColor: MyLightTheme.colors.surface }]}
    >
      <View style={styles.content}>
        <Text style={styles.deviceName}>{deviceData.name}</Text>
        <Text style={styles.power}>{deviceData.power} Вт</Text>
        <CustomSwitch
          value={isOn}
          onPress={handlePress}
          style={styles.switch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    elevation: 4,
  },
  switch: {
    width: 60,
    height: 26,
    marginTop: 10,
  },

  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: FONTS.SofiaSansBold,
    marginBottom: 8,
  },
  power: {
    fontSize: 14,
    color: MyLightTheme.colors.grayDark,
    fontFamily: FONTS.Marmelad,
  },
});
