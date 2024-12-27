import React, { useCallback, useState } from "react";
import { View } from "react-native";
import SelectList from "../UI/SelectList";
import MyInput from "../UI/MyInput";
import { importances } from "../../constants/importanceDevices";

export default function ReductDeviceCard({ deviceData, setDeviceData }) {
  const [selectedMetric, setSelectedMetric] = useState("power");
  const handleNameChange = useCallback(
    (value) => {
      setDeviceData(
        (prev) => ({
          ...prev,
          name: value.toString(),
        }),
        [setDeviceData]
      );
    },
    [setDeviceData]
  );

  const handlePowerChange = useCallback(
    (value) => {
      setDeviceData(
        (prev) => ({
          ...prev,
          power: convertToNumeric(value),
        }),
        [setDeviceData]
      );
    },
    [setDeviceData]
  );

  const handleImportanceChange = useCallback(
    (importanceId) => {
      setDeviceData((prev) => ({ ...prev, importanceId }));
    },
    [setDeviceData]
  );

  const handleYearlyConsumptionChange = useCallback(
    (value) => {
      const numericValue = convertToNumeric(value);
      setDeviceData((prev) => ({
        ...prev,
        power: ((numericValue * 1000) / (24 * 365)).toFixed(2),
      }));

      console.log(deviceData);
    },
    [setDeviceData]
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
      <View
        style={{
          flexDirection: "column",
          gap: 12,
          width: "100%",
          alignItems: "center",
        }}
      >
        <MyInput
          label="Назва приладу"
          initialValue={deviceData.name?.toString() ?? ""}
          onChangeText={handleNameChange}
          keyboardType="default"
          width={"100%"}
        />
        <SelectList
          title="Оберіть відомий показник"
          items={[
            { id: "power", type: "Споживча потужність (Вт)" },
            { id: "yearlyConsumption", type: "Річне споживання (кВт·год)" },
          ]}
          selectedTypeId={selectedMetric}
          onSelect={(metric) => setSelectedMetric(metric)}
          style={{ marginTop: 8, marginBottom: -4 }}
        />

        {selectedMetric === "power" && (
          <MyInput
            label="Споживча потужність (Вт)"
            initialValue={deviceData.power?.toString() ?? ""}
            onChangeText={handlePowerChange}
            keyboardType="numeric"
            width={"100%"}
          />
        )}

        {selectedMetric === "yearlyConsumption" && (
          <MyInput
            label="Річне споживання (кВт·год)"
            initialValue={deviceData.power?.toString() ?? ""}
            onChangeText={handleYearlyConsumptionChange}
            keyboardType="numeric"
            width={"100%"}
          />
        )}
      </View>

      <View style={{ marginTop: 8, width: "100%" }}>
        <SelectList
          title="Оберіть важливість приладу"
          items={importances}
          selectedTypeId={deviceData.importanceId || null}
          onSelect={handleImportanceChange}
        />
      </View>
    </View>
  );
}
