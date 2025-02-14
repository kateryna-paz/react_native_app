import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Icon } from "react-native-paper";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import useDistributeDevicesStore from "../../store/distributeStore";

export default function DeviceTitle({ item, onToggleSelect }) {
  const { selectedDevices } = useDistributeDevicesStore();

  const selectedItem = selectedDevices.find((dev) => dev.id === item.id);

  const [isSelected, setIsSelected] = useState(!!selectedItem);

  const handlePress = () => {
    setIsSelected((prev) => !prev);
    onToggleSelect(item.id);
  };

  return (
    <Pressable
      style={[
        styles.card,
        {
          backgroundColor: MyLightTheme.colors.surface,
          borderColor: isSelected
            ? MyLightTheme.colors.primary
            : MyLightTheme.colors.transparent,
        },
      ]}
      onPress={handlePress}
      pressRetentionOffset={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <View style={styles.content}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.power}>{item.power} Вт</Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Icon
              source="marker-check"
              size={20}
              color={MyLightTheme.colors.primary}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "auto",
    margin: 8,
    borderRadius: 12,
    elevation: 4,
    borderWidth: 2,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
    paddingVertical: 10,
    pointerEvents: "box-none",
  },
  deviceName: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: FONTS.SofiaSansBold,
  },
  power: {
    fontSize: 12,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: FONTS.Kurale,
  },
  checkmarkContainer: {
    position: "absolute",
    top: -2,
    right: 5,
  },
});
