import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { importances } from "../../constants/importanceDevices";
import SelectList from "../UI/SelectList";
import { useDispatch } from "react-redux";

export default function DeviceCard({ data }) {
  const theme = useTheme();

  const [deviceData, setDeviceData] = useState({
    name: data.name || "",
    power: data.power || 0,
    importanceId:
      importances.find((imp) => imp.type.toLowerCase() === data.importance)
        .id || null,
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <Text style={styles.deviceName}>{deviceData.name}</Text>
        <Text style={styles.power}>{deviceData.power} Вт</Text>
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

  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  deviceName: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SofiaSansBpld",
    marginBottom: 8,
  },
  power: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Marmelad",
  },
});
