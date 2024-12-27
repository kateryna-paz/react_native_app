import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DeviceCard from "./DeviceCard";
import { usePathname } from "expo-router";

export default function DevicesList({ devices, refresh }) {
  const currentPath = usePathname();

  if (currentPath === "/devices") {
    return (
      <View style={styles.devicesContainer}>
        {devices?.map((device) => {
          return <DeviceCard data={device} key={device.id} refresh={refresh} />;
        })}
      </View>
    );
  }

  if (currentPath === "/energy_distribution") {
    return (
      <View style={styles.disrtibutionContainer}>
        {devices?.map((device) => {
          return <DeviceCard data={device} key={device.id} refresh={refresh} />;
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  devicesContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  disrtibutionContainer: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",

    gap: 10,
  },
});
