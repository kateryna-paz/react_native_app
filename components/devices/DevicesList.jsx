import React from "react";
import { View, StyleSheet } from "react-native";
import DeviceCard from "./DeviceCard";
import { usePathname } from "expo-router";
import DeviceDistributionCard from "../distribution/DeviceCard";

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

  if (currentPath === "/energy_distribution/list") {
    return (
      <View style={styles.disrtibutionContainer}>
        {devices?.map((device) => {
          return (
            <DeviceDistributionCard
              data={device}
              key={device.id}
              refresh={refresh}
            />
          );
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
    paddingTop: 20,
  },
  disrtibutionContainer: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 8,
    justifyContent: "center",
  },
});
