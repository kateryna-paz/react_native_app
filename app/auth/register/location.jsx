import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import LocationsButtons from "../../../components/LocationsButtons";
import { ActivityIndicator, Icon } from "react-native-paper";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import CustomAlert from "../../../components/UI/CustomAlert";
import { useRegisterLocation } from "../../../hooks/auth/useRegisterLocation";

export default function LocationScreen() {
  const {
    location,
    showAlert,
    isLoading,
    handleRegister,
    handleFetchLocation,
    handleMapNavigation,
    handleConfirm,
  } = useRegisterLocation();

  const renderLocationStatus = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="small"
          color={MyLightTheme.colors.primaryDark}
        />
      );
    }

    if (location?.regionName) {
      return (
        <>
          <Icon source="check-outline" size={20} color="green" />
          <Text style={styles.status}>{location.regionName}</Text>
        </>
      );
    }

    return (
      <>
        <Icon source="close-outline" size={20} color="red" />
        <Text style={styles.status}>Не визначено</Text>
      </>
    );
  };

  return (
    <MyContainer
      colorStart={MyLightTheme.colors.primaryLight}
      colorEnd={MyLightTheme.colors.secondaryLight}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Останній крок!</Text>
        <Text style={styles.subtitle}>
          Давайте визначимо місцезнаходження панелей
        </Text>
        <View style={styles.locationContainer}>
          <LocationsButtons
            handleFetchLocation={handleFetchLocation}
            handleUseMap={handleMapNavigation}
          />
          <View style={styles.statusContainer}>{renderLocationStatus()}</View>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Завершити реєстрацію</Text>
        </TouchableOpacity>
      </View>
      <CustomAlert
        showAlert={showAlert}
        onConfirm={handleConfirm}
        onCancel={handleConfirm}
        showCancelButton={!!location}
        message={
          location
            ? `Широта: ${location.latitude}, \nДовгота: ${location.longitude}, \nВаша область: ${location.regionName}`
            : "Місцезнаходження не визначено"
        }
        title={"Ваше місцезнаходження"}
      />
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationContainer: {
    backgroundColor: MyLightTheme.colors.white,
    padding: 14,
    borderRadius: 8,
    marginBottom: 25,
    shadowColor: MyLightTheme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    fontFamily: FONTS.Kurale,
    textAlign: "center",
    color: MyLightTheme.colors.black,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 18,
    fontFamily: FONTS.Kurale,
    color: MyLightTheme.colors.black,
    textAlign: "center",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  nextButton: {
    width: "90%",
    backgroundColor: MyLightTheme.colors.primary,
  },
  buttonText: {
    fontSize: 18,
    color: MyLightTheme.colors.white,
    fontFamily: FONTS.Kurale,
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 4,
    marginLeft: -8,
  },
  status: {
    fontFamily: FONTS.Kurale,
    fontSize: 18,
    marginLeft: 10,
  },
});
