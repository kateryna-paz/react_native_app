import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

import { importances } from "../../constants/importanceDevices";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import CustomSwitch from "../UI/CustomSwitch";
import useDistributeDevicesStore from "../../store/distributeStore";
import DialogCreation from "../UI/DialogCreation";
import FixedDeviceTimeCard from "./FixedDeviceTimeCard";

export default function DeviceCard({ data, toggleSelect, selected }) {
  const { setDeviceWorkingTime } = useDistributeDevicesStore();
  const [reductOpen, setReductOpen] = useState(false);

  const deviceData = {
    name: data.name || "",
    power: data.power || 0,
    importanceId:
      importances.find((imp) => imp.type.toLowerCase() === data.importance)
        ?.id || null,
    workingHours: data.workingHours || 0,
    workingMinutes: data.workingMinutes || 0,
    deviceEnergy: data.deviceEnergy || 0,
    fixedTime: data.fixedTime || false,
    maxWorkingHours: data.maxWorkingHours || 0,
    maxWorkingMinutes: data.maxWorkingMinutes || 0,
  };

  const isOn = useSharedValue(selected ? selected : false);

  const [workingTime, setWorkingTime] = useState({
    workingHours: deviceData.workingHours,
    workingMinutes: deviceData.workingMinutes,
  });

  const fixedDeviceWorkingTime = () => {
    setDeviceWorkingTime(
      data.id,
      workingTime.workingHours,
      workingTime.workingMinutes
    );
    setReductOpen(false);
  };

  const handlePress = () => {
    toggleSelect(data.id);
    isOn.value = !isOn.value;
  };

  const handleReductPress = () => {
    if (selected) {
      setWorkingTime({
        workingHours: deviceData.workingHours,
        workingMinutes: deviceData.workingMinutes,
      });
      setReductOpen(true);
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(600)
        .withInitialValues({
          opacity: 0,
          transform: [{ scale: 0.8 }, { translateX: 50 }],
        })
        .springify()}
      exiting={FadeOut.duration(500)
        .withInitialValues({
          opacity: 1,
          transform: [{ scale: 1 }, { translateX: 0 }],
        })
        .springify()}
      layout={LinearTransition.springify().mass(0.8)}
      style={[
        styles.card,
        deviceData.fixedTime ? styles.fixed : "",
        { backgroundColor: MyLightTheme.colors.surface },
      ]}
    >
      <Pressable onPress={handleReductPress} style={styles.content}>
        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.deviceName}>{deviceData.name}</Text>
            <Text style={styles.power}>{deviceData.power} Вт</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.timeContent}>
              <Text style={styles.mainLabel}>{deviceData.workingHours}</Text>
              <Text style={styles.inputLabel}>год</Text>
              <Text style={styles.mainLabel}>{deviceData.workingMinutes}</Text>
              <Text style={styles.inputLabel}>хв</Text>
            </View>

            <View style={styles.energyContent}>
              <Text style={styles.mainLabel}> {deviceData.deviceEnergy}</Text>
              <Text style={styles.inputLabel}>кВт/год</Text>
            </View>
          </View>
        </View>

        <CustomSwitch
          value={isOn}
          onPress={handlePress}
          style={styles.switch}
        />
      </Pressable>

      {reductOpen && (
        <DialogCreation
          visible={reductOpen}
          hideDialog={() => setReductOpen(false)}
          title="Налаштування часу роботи приладу"
          saveChanges={fixedDeviceWorkingTime}
        >
          <FixedDeviceTimeCard
            deviceData={workingTime}
            setFixedTime={setWorkingTime}
            maxWorkingHours={deviceData.maxWorkingHours}
            maxWorkingMinutes={deviceData.maxWorkingMinutes}
          />
        </DialogCreation>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    borderRadius: 12,
    elevation: 4,
  },
  fixed: {
    borderWidth: 2,
    borderColor: MyLightTheme.colors.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  column: {
    flexDirection: "column",
  },
  switch: {
    width: 46,
    height: 20,
    marginVertical: 10,
    transform: [{ rotate: "-90deg" }],
  },
  content: {
    padding: 20,
    paddingVertical: 18,
    paddingRight: 8,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  deviceName: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: FONTS.SofiaSansBold,
  },
  power: {
    fontSize: 14,
    lineHeight: 28,
    color: MyLightTheme.colors.grayDark,
    fontFamily: FONTS.Marmelad,
  },
  inputContainer: {
    flexDirection: "row",
    gap: "30%",
    alignItems: "center",
    marginTop: 4,
  },
  mainLabel: {
    fontSize: 17,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: FONTS.Marmelad,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 15,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: FONTS.Marmelad,
    textAlign: "center",
  },
  timeContent: {
    flexDirection: "row",
    marginLeft: 10,
    gap: 10,
    alignItems: "center",
  },
  energyContent: {
    flexDirection: "column",
    alignItems: "center",
  },
});
