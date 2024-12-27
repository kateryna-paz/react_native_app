import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import LocationsButtons from "../../../components/LocationsButtons";
import { useDispatch, useSelector } from "react-redux";
import {
  addLocation,
  setPermission,
  setRegisterLocationWithGeo,
} from "../../../store/slices/locationAndMapSlice";
import { ActivityIndicator, Icon, useTheme } from "react-native-paper";
import { registerUser } from "../../../store/slices/authSlice";
import { addPanel } from "../../../store/slices/panelSlice";
import { MyLightTheme } from "../../../assets/theme/global";
import LoadingScreen from "../../../components/UI/LoadingScreen";

export default function LocationScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const [localIsLoading, setLocalIsLoading] = useState(false);

  const { permission, registerLocation, isLoading } = useSelector(
    (state) => state.location
  );
  const {
    user,
    isLoading: userLoading,
    error: userError,
  } = useSelector((state) => state.auth);
  const {
    panels,
    registerPanel,
    isLoading: isPanelLoading,
    error,
  } = useSelector((state) => state.panel);
  const [location, setLocation] = useState(null);

  const handleRegister = async () => {
    setLocalIsLoading(true);
    try {
      const userResult = await dispatch(registerUser()).unwrap();
      if (!userResult || userResult?.error) {
        throw new Error("User registration failed.");
      }

      const panelResult = await dispatch(
        addPanel({ ...registerPanel })
      ).unwrap();
      if (!panelResult || panelResult?.error) {
        throw new Error("Panel creation failed.");
      }

      const locationResult = await dispatch(addLocation()).unwrap();
      if (!locationResult || locationResult?.error) {
        throw new Error("Location registration failed.");
      }

      router.push("/profile");
    } catch (err) {
      Alert.alert("Помилка", err || "Щось пішло не так");
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleFetchLocation = async () => {
    try {
      const result = await dispatch(setRegisterLocationWithGeo()).unwrap();
      setLocation(result);
      Alert.alert(
        "Ваше місцезнаходження",
        `Широта: ${result.latitude}, \nДовгота: ${result.longitude}, \nВаша область:  ${result.regionName}`
      );
    } catch (err) {
      Alert.alert("Помилка", err || "Щось пішло не так");
    }
  };

  useEffect(() => {
    if (!permission) {
      dispatch(setPermission());
    }
    if (registerLocation) {
      setLocation(registerLocation);
    }
  }, [permission, registerLocation]);

  const renderLocationStatus = () => {
    if (isLoading) {
      return (
        <ActivityIndicator size="small" color={theme.colors.primaryDark} />
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

  if (localIsLoading) {
    return (
      <LoadingScreen
        colorStart={theme.colors.primaryDark}
        colorEnd={theme.colors.primaryLight}
        indicatorColor={theme.colors.white}
      />
    );
  }

  return (
    <MyContainer
      colorStart={theme.colors.primaryDark}
      colorEnd={theme.colors.primaryLight}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Останній крок!</Text>
        <Text style={styles.subtitle}>
          Давайте визначимо місцезнаходження панелей
        </Text>
        <View style={styles.locationContainer}>
          <LocationsButtons
            handleFetchLocation={handleFetchLocation}
            handleUseMap={() =>
              router.push({
                pathname: "/auth/register/map",
                params: {
                  // ???
                  onSaveLocation: () => dispatch(setRegisterLocationWithGeo()),
                },
              })
            }
          />
          <View style={styles.statusContainer}>{renderLocationStatus()}</View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left-thin"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Завершити реєстрацію</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    backgroundColor: MyLightTheme.colors.background,
    padding: 14,
    borderRadius: 8,
    marginBottom: 25,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    fontFamily: "Kurale",
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 18,
    fontFamily: "Kurale",
    color: MyLightTheme.colors.background,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
  },

  backButton: {
    width: "20%",
    borderWidth: 2,
    borderColor: MyLightTheme.colors.primary,
    backgroundColor: MyLightTheme.colors.background,
  },
  nextButton: {
    width: "70%",
    backgroundColor: MyLightTheme.colors.primary,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontFamily: "Kurale",
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
    fontFamily: "Kurale",
    fontSize: 18,
    marginLeft: 10,
  },
});
