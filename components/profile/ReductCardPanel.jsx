import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import SelectList from "../UI/SelectList";

export default function ReductPanelCard({
  panelData,
  setPanelData,
  panelTypes,
}) {
  const handleInputChange = (key, value) => {
    setPanelData((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (typeId) => {
    setPanelData((prev) => ({ ...prev, typeId }));
  };

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 15,
        alignItems: "center",
      }}
    >
      <View style={{ width: "100%" }}>
        <SelectList
          title="Оберіть тип панелей"
          items={panelTypes}
          selectedTypeId={panelData.typeId}
          onSelect={handleTypeChange}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
        }}
      >
        <TextInput
          label="Площа 1 (м²)"
          placeholder="5"
          mode="outlined"
          value={panelData.square.toString() || 0}
          onChangeText={(val) => handleInputChange("square", +val)}
          style={{
            fontFamily: "Kurale",
            fontSize: 16,
            width: "47%",
          }}
          keyboardType="numeric"
        />
        <TextInput
          label="Кількість"
          placeholder="10"
          mode="outlined"
          value={panelData.number.toString() || 0}
          onChangeText={(val) => handleInputChange("number", +val)}
          style={{
            fontFamily: "Kurale",
            fontSize: 16,
            width: "47%",
          }}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
