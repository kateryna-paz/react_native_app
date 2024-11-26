import React, { useEffect } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocation, setPermission } from "../../store/slices/locationSlice";

export default function LocationSection() {
  const dispatch = useDispatch();
  const { location, permission, isLoading, error } = useSelector(
    (state) => state.location
  );

  const handleFetchLocation = async () => {
    try {
      const result = await dispatch(fetchLocation()).unwrap();
      Alert.alert(
        "Ваше місцезнаходження",
        `Широта: ${result.latitude}, \nДовгота: ${result.longitude}, \nВаша область:  ${result.region}, ${result.city}`
      );
    } catch (err) {
      Alert.alert("Помилка", err);
    }
  };

  const handleUseMap = async () => {
    router.push("/profile/map");
  };

  useEffect(() => {
    if (!permission) {
      dispatch(setPermission());
    }
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Місце розташування панелей</Text>
      <Button
        mode="outlined"
        onPress={handleFetchLocation}
        contentStyle={styles.buttonContent}
        textColor={"black"}
        style={styles.outlinedButton}
      >
        {isLoading && <ActivityIndicator size="small" color="#51bbfe" />}
        {!isLoading && (
          <>
            <Text style={styles.buttonText}>
              Скористатись геолокацією{"  "}
            </Text>
            <FontAwesome name="map-marker" size={21} color="black" />
          </>
        )}
      </Button>
      <Button
        mode="contained"
        onPress={handleUseMap}
        contentStyle={styles.buttonContent}
        buttonColor={"#ddA500"}
        textColor={"white"}
        style={styles.containedButton}
      >
        <Text style={styles.buttonText}>Показати на карті{"  "}</Text>
        <FontAwesome name="map-o" size={20} color="white" />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 16,
  },
  title: {
    fontFamily: "Marmelad",
    fontSize: 24,
    marginBottom: 12,
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
