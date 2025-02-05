import React from "react";
import { View, StyleSheet } from "react-native";
import { MyLightTheme } from "../../assets/theme/global";
import DeviceCardHeader from "./DeviceCardHeader";
import DeviceCardContent from "./DeviceCardContent";
import DeviceCardDialogs from "./DeviceCardDialogs";
import { useDeviceCard } from "../../hooks/devices/useDeviceCard";

export default function DeviceCard({ data, refresh }) {
  const {
    deviceData,
    setDeviceData,
    reductOpen,
    deleteOpen,
    handleReductDialog,
    handleDeleteDialog,
    handleUpdateDevice,
    handleDeleteDevice,
  } = useDeviceCard(data, refresh);

  return (
    <View
      style={[styles.card, { backgroundColor: MyLightTheme.colors.surface }]}
    >
      <DeviceCardHeader
        onDeletePress={handleDeleteDialog}
        onEditPress={handleReductDialog}
      />
      <DeviceCardContent deviceData={deviceData} />

      <DeviceCardDialogs
        reductOpen={reductOpen}
        deleteOpen={deleteOpen}
        handleReductDialog={handleReductDialog}
        handleDeleteDialog={handleDeleteDialog}
        handleUpdateDevice={handleUpdateDevice}
        handleDeleteDevice={handleDeleteDevice}
        deviceData={deviceData}
        setDeviceData={setDeviceData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    width: "45%",
    elevation: 4,
    paddingBottom: 14,
    flexDirection: "column",
    justifyContent: "space-between",
  },
});
