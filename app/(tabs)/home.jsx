import { StyleSheet, View, Text, Button } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Link } from "expo-router";

export default HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    if (status == "granted") {
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation({
          lon: location.coords.longitude,
          lat: location.coords.latitude,
        });
      } catch (error) {
        setErrorMsg("Error fetching location");
        console.log(error);
      }
    } else {
      setErrorMsg("Location permission denied");
    }
  };

  let text = "Click the button below";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome!</Text>
      <View
        style={{ marginTop: 10, padding: 10, borderRadius: 10, width: "40%" }}
      >
        <Button title="Get Location" onPress={getLocation} />
      </View>
      <Text style={styles.pText}>Location: {text}</Text>
      <View
        style={{ marginTop: 10, padding: 10, borderRadius: 10, width: "40%" }}
      >
        <Link style={styles.link} href="/profile">
          Go to profile
        </Link>
      </View>
    </View>
  );
};

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
  link: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    color: "#fff",
    fontSize: 18,
  },
});
