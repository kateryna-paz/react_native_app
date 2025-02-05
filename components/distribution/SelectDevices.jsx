import React from "react";
import { View, StyleSheet } from "react-native";
import DeviceTitle from "./DeviceTitle";

export default function SelectDevices({ devices, toggleSelectDevice }) {
  return (
    <View style={styles.container}>
      {devices.map((device) => {
        return (
          <DeviceTitle
            key={device.id}
            item={device}
            onToggleSelect={toggleSelectDevice}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
