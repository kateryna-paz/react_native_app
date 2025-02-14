import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import MyInput from "../UI/MyInput";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function FixedDeviceTimeCard({
  deviceData,
  setFixedTime,
  maxWorkingHours,
  maxWorkingMinutes,
}) {
  const handleHoursChange = useCallback(
    (value) => {
      const hours = Math.min(
        Math.max(0, Number(value) || 0),
        deviceData.workingMinutes > maxWorkingMinutes
          ? maxWorkingHours - 1
          : maxWorkingHours
      );
      setFixedTime(
        (prev) => ({
          ...prev,
          workingHours: hours,
        }),
        [setFixedTime]
      );
    },
    [
      setFixedTime,
      maxWorkingHours,
      deviceData.workingMinutes,
      maxWorkingMinutes,
    ]
  );

  const handleMinutesChange = useCallback(
    (value) => {
      const minutes = Math.min(
        Math.max(0, Number(value) || 0),
        deviceData.workingHours < maxWorkingHours ? 60 : maxWorkingMinutes + 1
      );
      setFixedTime(
        (prev) => ({
          ...prev,
          workingMinutes: minutes,
        }),
        [setFixedTime]
      );
    },
    [setFixedTime, maxWorkingMinutes, deviceData.workingHours, maxWorkingHours]
  );

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 15,
        alignItems: "center",
      }}
    >
      <Text style={styles.mainLabel}>Максимальний час роботи: </Text>
      <View style={styles.timeContent}>
        <Text style={styles.mainLabel}>{maxWorkingHours}</Text>
        <Text style={styles.mainLabel}>год {"  "}</Text>
        <Text style={styles.mainLabel}>{maxWorkingMinutes}</Text>
        <Text style={styles.mainLabel}>хв</Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          gap: 12,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={styles.inputContainer}>
          <MyInput
            value={deviceData.workingHours.toString()}
            onChangeText={handleHoursChange}
            maxValue={
              deviceData.workingMinutes > maxWorkingMinutes
                ? maxWorkingHours
                : maxWorkingHours + 1
            }
            styles={styles.input}
          />
          <Text style={styles.inputLabel}>год</Text>
          <MyInput
            value={deviceData.workingMinutes.toString()}
            onChangeText={handleMinutesChange}
            maxValue={
              deviceData.workingHours < maxWorkingHours
                ? 60
                : maxWorkingMinutes + 1
            }
            styles={styles.input}
          />
          <Text style={styles.inputLabel}>хв</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    width: 52,
    height: 40,
    fontSize: 18,
    paddingLeft: 4,
  },
  inputLabel: {
    fontSize: 18,
    paddingTop: 10,
    paddingRight: 10,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: FONTS.Marmelad,
  },
  mainLabel: {
    fontSize: 16,
    marginTop: -8,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: FONTS.Marmelad,
    textAlign: "center",
  },
  timeContent: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
});
