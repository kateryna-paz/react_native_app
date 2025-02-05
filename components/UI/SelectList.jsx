import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

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
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const selectedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Array.isArray(items) && selectedTypeId) {
      const initialItem = items.find((item) => item.id === selectedTypeId);

      if (initialItem) {
        setSelectedItem(initialItem);
      }
    }
  }, [selectedTypeId, items]);

  const handleOpen = (isOpened) => {
    Animated.timing(dropdownAnim, {
      toValue: isOpened ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    if (onSelect) onSelect(item.id);

    Animated.sequence([
      Animated.timing(selectedAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(selectedAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SelectDropdown
      data={items}
      onSelect={handleSelect}
      renderButton={(currentSelectedItem, isOpened) => {
        handleOpen(isOpened);

        return (
          <Animated.View
            style={[
              styles.dropdownButtonStyle,
              style,
              {
                transform: [
                  {
                    scale: dropdownAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.05],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.dropdownButtonTxtStyle,
                textStyle,
                {
                  transform: [
                    {
                      scale: selectedAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {currentSelectedItem?.type || selectedItem?.type || title}
            </Animated.Text>
            <Icon
              name={isOpened ? "chevron-up" : "chevron-down"}
              style={[styles.dropdownButtonArrowStyle, arrowStyle]}
            />
          </Animated.View>
        );
      }}
      renderItem={(item) => (
        <View
          style={{
            ...styles.dropdownItemStyle,
            ...(item.id === selectedItem?.id && {
              backgroundColor: MyLightTheme.colors.primarySelected,
            }),
          }}
        >
          <Text style={[styles.dropdownButtonTxtStyle, textStyle]}>
            {item.type}
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "auto",
    height: 44,
    backgroundColor: MyLightTheme.colors.primary,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    color: MyLightTheme.colors.white,
    fontFamily: FONTS.Kurale,
    fontSize: 16,
  },
  dropdownButtonArrowStyle: {
    color: MyLightTheme.colors.white,
    fontSize: 26,
  },
  dropdownMenuStyle: {
    backgroundColor: MyLightTheme.colors.primary,
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
