import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

export default function DeviceTitle({ item }) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.deviceName}>{item.name}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
});
