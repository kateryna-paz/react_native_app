import React, { useCallback } from "react";
import { View } from "react-native";
import SelectList from "../UI/SelectList";
import MyInput from "../UI/MyInput";

export default function ReductPanelCard({
  panelData,
  setPanelData,
  panelTypes,
}) {
  const handlePowerChange = useCallback(
    (value) => {
      setPanelData(
        (prev) => ({
          ...prev,
          power: convertToNumeric(value),
        }),
        [setPanelData]
      );
    },
    [setPanelData]
  );

  const handleNumberChange = useCallback(
    (value) => {
      setPanelData(
        (prev) => ({
          ...prev,
          number: convertToNumeric(value),
        }),
        [setPanelData]
      );
    },
    [setPanelData]
  );

  const handleTypeChange = useCallback(
    (typeId) => {
      setPanelData((prev) => ({ ...prev, typeId }));
    },
    [setPanelData]
  );

  const convertToNumeric = (value) => {
    const normalized = value.replace(",", ".");
    return normalized === "" ? null : Number(normalized);
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
        <MyInput
          label="Потужність (Вт)"
          initialValue={panelData.power?.toString() ?? ""}
          onChangeText={handlePowerChange}
        />
        <MyInput
          label="Кількість"
          initialValue={panelData.number?.toString() ?? ""}
          onChangeText={handleNumberChange}
        />
      </View>
    </View>
  );
}
