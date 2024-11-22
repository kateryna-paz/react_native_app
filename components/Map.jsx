import { Link, router, useNavigation } from "expo-router";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setCoordinatesAndFetchAddress } from "../store/slices/locationSlice";
import { setMapMarkerCoordinates } from "../store/slices/mapSlice";
import { useState, useEffect } from "react";

const INITIAL_REGION = {
  latitude: 49.4501,
  longitude: 31.5234,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

export default function Map() {
  const dispatch = useDispatch();
  const { markerCoords } = useSelector((state) => state.map);

  const [currentCoords, setCurrentCoords] = useState(
    markerCoords || INITIAL_REGION
  );

  const onRegionChangeComplete = (region) => {
    setCurrentCoords(region);
  };

  const saveLocation = async () => {
    try {
      await dispatch(setMapMarkerCoordinates(currentCoords));
      const result = await dispatch(
        setCoordinatesAndFetchAddress(currentCoords)
      );

      const { latitude, longitude, region, city } = result.payload;

      Alert.alert(
        "Ваше місцезнаходження",
        `Широта: ${latitude}, \nДовгота: ${longitude}, \nВаша область: ${region}, ${city}`,
        [
          { text: "Відмінити", style: "cancel" },
          { text: "ОК", onPress: () => router.back() },
        ]
      );
    } catch (error) {
      console.error("Помилка:", error);
      Alert.alert("Помилка", "Не вдалося зберегти місцезнаходження.");
    }
  };

  useEffect(() => {
    if (markerCoords) {
      setCurrentCoords(markerCoords);
    } else {
      setCurrentCoords(INITIAL_REGION);
    }
  }, []);

  if (!currentCoords) {
    return;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={INITIAL_REGION}
        provider={PROVIDER_GOOGLE}
      >
        {currentCoords && (
          <Marker
            coordinate={
              {
                latitude: currentCoords.latitude,
                longitude: currentCoords.longitude,
              } || INITIAL_REGION
            }
            title="Your Location"
            style={styles.marker}
            draggable
            onDragEnd={(e) =>
              setCurrentCoords({
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }
          />
        )}

        <Circle
          center={{ latitude: 49.4501, longitude: 31.5234 }}
          radius={2}
          strokeColor="rgba(0, 0, 255, 0.1)"
          fillColor="rgba(0, 0, 255, 0)"
        />
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
    width: 50,
    height: 50,
  },
});
