import React from "react";
import { View, Text } from "react-native";
import PanelCard from "./PanelCard";

export default function PanelsInfoSection() {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontFamily: "Marmelad",
          fontSize: 24,
          marginLeft: 10,
          marginBottom: 12,
        }}
      >
        {" "}
        Сонячні панелі{" "}
      </Text>
      <PanelCard />
    </View>
  );
}
