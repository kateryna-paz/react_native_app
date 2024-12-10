import React, { useCallback, useEffect } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import SelectList from "../UI/SelectList";
import { useDebounce } from "../../hooks/useDebounce";

export default function ReductPanelCard({
  panelData,
  setPanelData,
  panelTypes,
}) {
  const debouncedSetPanelData = useDebounce((key, value) => {
    setPanelData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, 300);

  const handleInputChange = (key, value) => {
    debouncedSetPanelData(key, value);
  };

  const handleTypeChange = useCallback(
    (typeId) => {
      setPanelData((prev) => ({ ...prev, typeId }));
    },
    [setPanelData]
  );

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
          mode="outlined"
          value={panelData.square ? panelData.square.toString() : ""}
          onChangeText={(val) => handleInputChange("square", val)}
          style={{
            fontFamily: "Kurale",
            fontSize: 16,
            width: "47%",
          }}
          keyboardType="numeric"
          editable={true}
        />
        <TextInput
          label="Кількість"
          mode="outlined"
          value={panelData.number ? panelData.number.toString() : ""}
          onChangeText={(val) => handleInputChange("number", val)}
          style={{
            fontFamily: "Kurale",
            fontSize: 16,
            width: "47%",
          }}
          keyboardType="numeric"
          editable={true}
        />
      </View>
    </View>
  );
}
