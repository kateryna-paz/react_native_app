import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import useLocation from "../../hooks/useLocation";

export default function LocationSection() {
  const { location, error, isLoading, fetchLocation } = useLocation();

  const { latitude, longitude, country, region, city, street, house } =
    location;

  const handleFetchLocation = async () => {
    await fetchLocation();

    console.log(latitude, longitude);

    if (error) {
      Alert.alert("Помилка", error);
    } else if (latitude && longitude) {
      Alert.alert(
        "Ваше місцезнаходження",
        `Широта: ${latitude}, Довгота: ${longitude}, Ваша адреса: ${country}, ${region}, ${city}, ${street}, ${house}`
      );
    }
  };
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
        onPress={() => {
          router.push("/profile/map");
        }}
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
    padding: 10,
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
