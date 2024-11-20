import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Link } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { Button } from "react-native-elements";

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await new Promise((resolve) => setTimeout(resolve, 500));

        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          lon: location.coords.longitude,
          lat: location.coords.latitude,
        });
        setIsLoading(false);
      } else {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    } catch (error) {
      setErrorMsg("Error fetching location: " + error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome!</Text>
      <Button onPress={fetchLocation} title={"Get Location"} />
      {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
      {errorMsg && <Text style={styles.pText}>{errorMsg}</Text>}
      {location && (
        <Text style={styles.pText}>Location: {JSON.stringify(location)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Rubik",
  },
  pText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    width: "40%",
  },
  link: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
