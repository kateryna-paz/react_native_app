import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function SelectList({
  title,
  items,
  selectedTypeId,
  onSelect,
  style,
  textStyle,
  arrowStyle,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (Array.isArray(items) && selectedTypeId) {
      const initialItem = items.find((item) => item.id === selectedTypeId);

      if (initialItem) {
        setSelectedItem(initialItem);
      }
    }
  }, [selectedTypeId, items]);

  return (
    <SelectDropdown
      data={items}
      onSelect={(item) => {
        setSelectedItem(item);
        if (onSelect) onSelect(item.id);
      }}
      renderButton={(currentSelectedItem, isOpened) => {
        return (
          <View style={[styles.dropdownButtonStyle, style]}>
            <Text style={[styles.dropdownButtonTxtStyle, textStyle]}>
              {currentSelectedItem?.type || selectedItem?.type || title}
            </Text>
            <Icon
              name={isOpened ? "chevron-up" : "chevron-down"}
              style={[styles.dropdownButtonArrowStyle, arrowStyle]}
            />
          </View>
        );
      }}
      renderItem={(item) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(item.id === selectedItem?.id && {
                backgroundColor: "#7E44C9",
              }),
            }}
          >
            <Text style={[styles.dropdownButtonTxtStyle, textStyle]}>
              {item.type}
            </Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "auto",
    height: 44,
    backgroundColor: "#672ab7",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    color: "white",
    fontFamily: "Kurale",
    fontSize: 16,
  },
  dropdownButtonArrowStyle: {
    color: "white",
    fontSize: 26,
  },
  dropdownMenuStyle: {
    backgroundColor: "#672ab7",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
});
