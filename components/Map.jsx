import { Link, router, useNavigation } from "expo-router";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import { useState } from "react";
import { FAB } from "react-native-paper";

const INITIAL_REGION = {
  latitude: 48.5336,
  longitude: 32.6369,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

export default function Map() {
  const onRegionChange = (region) => {
    setDraggableMarkerCoords({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const saveLocation = () => {
    setUserLocation(draggableMarkerCoords);
    Alert.alert("Ваше місцезнаходження", JSON.stringify(userLocation), [
      {
        text: "Відмінити",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "ОК", onPress: () => router.push("/profile") },
    ]);
  };

  const [draggableMarkerCoords, setDraggableMarkerCoords] = useState({
    latitude: 48.3367,
    longitude: 32.0194,
  });
  const [userLocation, setUserLocation] = useState(draggableMarkerCoords);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        onRegionChange={onRegionChange}
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
      >
        <Marker
          coordinate={draggableMarkerCoords}
          title="Your Location"
          style={styles.marker}
          onDragEnd={(e) => setDraggableMarkerCoords(e.nativeEvent.coordinate)}
        ></Marker>
      </MapView>
      <FAB
        onPress={() => {
          router.back();
        }}
        icon={"arrow-left"}
        style={styles.btnBack}
        customSize={46}
      />
      <FAB
        onPress={saveLocation}
        style={styles.btnSave}
        label="Зберегти"
        icon={"check"}
        customSize={48}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  btnSave: {
    right: 0,
    position: "absolute",
    top: 0,
    margin: 16,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "#1F6228",
  },
  btnBack: {
    left: 0,
    position: "absolute",
    top: 0,
    margin: 16,
    marginTop: 19,
    backgroundColor: "white",
  },
  marker: {
    width: 45,
    height: 45,
  },
});
