import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  Icon,
  IconButton,
  useTheme,
} from "react-native-paper";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocation,
  getLocationWithGeo,
  setPermission,
} from "../../store/slices/locationAndMapSlice";
import LocationsButtons from "../LocationsButtons";

export default function LocationSection() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { location, permission, isLoading, error } = useSelector(
    (state) => state.location
  );

  const [localLocation, setLocalLocation] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState(false);

  const openOptions = () => {
    setVisibleOptions(!visibleOptions);
  };

  const handleFetchLocation = async () => {
    try {
      const result = await dispatch(getLocationWithGeo()).unwrap();
      Alert.alert(
        "Ваше місцезнаходження",
        `Широта: ${result.latitude}, \nДовгота: ${result.longitude}, \nВаша область:  ${result.regionName}`
      );
      setVisibleOptions(false);
    } catch (err) {
      Alert.alert("Помилка", err);
    }
  };

  const handleUseMap = async () => {
    router.push(`/profile/map`);
    setVisibleOptions(false);
  };

  useEffect(() => {
    if (!permission) {
      dispatch(setPermission());
    }
    if (!location) {
      dispatch(fetchLocation());
      setVisibleOptions(false);
    }
    if (location) {
      setLocalLocation(location);
    }
  }, [permission, location]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Розташування панелей</Text>

      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 30, marginBottom: 20 }}
          size="large"
          color={theme.colors.secondary}
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
                  Неправильна локація? Змініть
                </Text>
                <IconButton
                  icon="arrow-down-drop-circle-outline"
                  size={28}
                  iconColor={theme.colors.primary}
                  onPress={openOptions}
                  style={[styles.icon, visibleOptions && styles.iconRotated]}
                />
              </View>
              {visibleOptions && (
                <LocationsButtons
                  handleFetchLocation={handleFetchLocation}
                  handleUseMap={handleUseMap}
                />
              )}
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
    backgroundColor: "#f5f5f5",
    padding: 14,
    borderRadius: 8,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontFamily: "Marmelad",
    fontSize: 24,
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
    fontFamily: "Kurale",
    fontSize: 18,
    marginLeft: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 10,
    marginVertical: -8,
    marginTop: -12,
  },
  icon: {
    transform: [{ rotate: "0deg" }],
  },
  iconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontFamily: "Marmelad",
    marginBottom: 6,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Kurale",
    fontSize: 18,
    lineHeight: 28,
  },
  outlinedButton: {
    marginVertical: 6,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: "#ddA500",
    height: 50,
  },
  containedButton: {
    marginVertical: 6,
    marginHorizontal: 10,
    paddingTop: 4,
    height: 50,
  },
});
