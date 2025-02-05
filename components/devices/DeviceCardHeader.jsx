import React from "react";
import { View, Pressable } from "react-native";
import { Icon } from "react-native-paper";
import { MyLightTheme } from "../../assets/theme/global";

const DeviceCardHeader = ({ onEditPress, onDeletePress }) => {
  return (
    <View style={styles.header}>
      <Pressable onPress={onDeletePress} style={styles.deleteButton}>
        <Icon source="delete" size={18} color={MyLightTheme.colors.accent} />
      </Pressable>
      <Pressable onPress={onEditPress} style={styles.editButton}>
        <Icon source="pencil" size={18} color={MyLightTheme.colors.primary} />
      </Pressable>
    </View>
  );
};

const styles = {
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: -1,
    right: -1,
    left: -1,
  },
  deleteButton: {
    opacity: 0.6,
    padding: 10,
    borderTopStartRadius: 12,
    borderTopEndRadius: 2,
    borderBottomLeftRadius: 2,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: MyLightTheme.colors.accent,
  },
  editButton: {
    backgroundColor: MyLightTheme.colors.secondary,
    padding: 10,
    paddingLeft: 12,
    opacity: 0.6,
    borderRadius: 24,
    borderTopEndRadius: 12,
    borderTopStartRadius: 2,
    borderBottomRightRadius: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: MyLightTheme.colors.primary,
  },
};

export default DeviceCardHeader;
