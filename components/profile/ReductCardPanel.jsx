import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
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
          power: value,
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
          number: value,
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

  return (
    <View style={styles.container}>
      <View style={styles.selectContainer}>
        <SelectList
          title="Оберіть тип панелей"
          items={panelTypes}
          selectedTypeId={panelData.typeId}
          onSelect={handleTypeChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <MyInput
          label="Потужність (Вт)"
          initialValue={panelData.power?.toString() ?? ""}
          onChangeText={handlePowerChange}
          styles={styles.firstInput}
        />

        <MyInput
          label="Кількість"
          initialValue={panelData.number?.toString() ?? ""}
          onChangeText={handleNumberChange}
          styles={styles.secondInput}
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 15,
    alignItems: "center",
  },
  selectContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  firstInput: {
    width: "58%",
  },
  secondInput: {
    width: "40%",
  },
});
