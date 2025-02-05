import React from "react";
import { View, Text } from "react-native";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import ImportanceBar from "./ImportanceBar";

const DeviceCardContent = ({ deviceData }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.deviceName}>{deviceData.name}</Text>
      <Text style={styles.power}>{deviceData.power} Вт</Text>
      <Text style={styles.importanceText}>{deviceData.importance}</Text>
      <ImportanceBar importance={deviceData.importance} />
    </View>
  );
};

const styles = {
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 42,
    paddingHorizontal: 2,
    flexGrow: 1,
  },
  importanceText: {
    fontSize: 15,
    color: MyLightTheme.colors.grayDark,
    fontFamily: FONTS.SofiaSansBold,
    marginTop: 4,
    textAlign: "center",
  },
  deviceName: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: FONTS.SofiaSansBold,
    marginBottom: 8,
    textAlign: "center",
    flexWrap: "wrap",
    width: "90%",
  },
  power: {
    fontSize: 14,
    color: MyLightTheme.colors.grayDark,
    fontFamily: FONTS.SofiaSansBold,
    marginBottom: 16,
  },
};

export default DeviceCardContent;
