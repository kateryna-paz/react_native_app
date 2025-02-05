import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ActivityIndicator, Icon, IconButton } from "react-native-paper";
import Animated from "react-native-reanimated";
import LocationsButtons from "../LocationsButtons";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import { useLocationSection } from "../../hooks/profile/useLocationSection";

export default function LocationSection() {
  const {
    localLocation,
    isLoading,
    optionsStyle,
    iconStyle,
    openOptions,
    handleFetchLocation,
    handleUseMap,
  } = useLocationSection();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Розташування панелей</Text>

      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 30, marginBottom: 20 }}
          size="small"
          color={MyLightTheme.colors.primary}
        />
      ) : (
        <>
          {localLocation?.regionName ? (
            <>
              <View style={styles.subtitleContainer}>
                <Icon source="check-outline" size={20} color="green" />
                <Text style={styles.subtitle}>{localLocation?.regionName}</Text>
              </View>
              <View style={styles.option}>
                <Text style={styles.description}>
                  Натисніть, щоб змінити локацію
                </Text>
                <Animated.View style={iconStyle}>
                  <IconButton
                    icon="arrow-down-drop-circle-outline"
                    size={24}
                    iconColor={MyLightTheme.colors.primary}
                    onPress={openOptions}
                  />
                </Animated.View>
              </View>
              <Animated.View style={optionsStyle}>
                <LocationsButtons
                  handleFetchLocation={handleFetchLocation}
                  handleUseMap={handleUseMap}
                />
              </Animated.View>
            </>
          ) : (
            <>
              <View style={styles.subtitleContainer}>
                <Icon source="close-outline" size={20} color="red" />
                <Text style={styles.subtitle}>Не визначено</Text>
              </View>
              <Text style={styles.description}>Оберіть спосіб визначення</Text>
              <LocationsButtons
                handleFetchLocation={handleFetchLocation}
                handleUseMap={handleUseMap}
              />
            </>
          )}
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    borderRadius: 8,
    marginVertical: 6,
    paddingVertical: 8,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: MyLightTheme.colors.secondaryDark,
  },
  title: {
    fontFamily: FONTS.Marmelad,
    fontSize: 26,
    marginBottom: 12,
    marginLeft: 2,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 10,
  },
  subtitle: {
    fontFamily: FONTS.Kurale,
    fontSize: 18,
    marginLeft: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: -10,
    marginTop: -14,
  },
  description: {
    fontSize: 16,
    color: MyLightTheme.colors.grayDark,
    textAlign: "center",
    fontFamily: FONTS.Marmelad,
    marginBottom: 3,
  },
});
