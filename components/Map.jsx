import { useRouter } from "expo-router";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  setCoordinatesAndFetchAddress,
  setMapMarkerCoordinates,
  setRegisterLocationWithMap,
} from "../store/slices/locationAndMapSlice";
import { useState, useEffect, useCallback } from "react";
import ErrorText from "./UI/ErrorText";

const INITIAL_REGION = {
  latitude: 49.4501,
  longitude: 31.5234,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

export default function Map({ forRegister }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { params } = router;
  const onSaveLocation = params?.onSaveLocation;

  const { markerCoords, location, isLoading, error } = useSelector(
    (state) => state.location
  );

  const [currentCoords, setCurrentCoords] = useState(
    markerCoords || INITIAL_REGION
  );

  const onRegionChangeComplete = (region) => {
    setCurrentCoords(region);
  };

  const saveLocation = useCallback(async () => {
    try {
      dispatch(setMapMarkerCoordinates(currentCoords));
      let result;
      if (forRegister) {
        result = await dispatch(
          setRegisterLocationWithMap(currentCoords)
        ).unwrap();
      } else {
        result = await dispatch(
          setCoordinatesAndFetchAddress(currentCoords)
        ).unwrap();
      }

      Alert.alert(
        "Ваше місцезнаходження",
        `Широта: ${result?.latitude}, \nДовгота: ${result?.longitude}, \nВаша область: ${result?.regionName}`,
        [
          { text: "Відмінити", style: "cancel" },
          {
            text: "ОК",
            onPress: () => {
              if (onSaveLocation) onSaveLocation();
              router.back();
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert("Помилка", "Не вдалося зберегти місцезнаходження.");
    }
  }, [currentCoords]);

  useEffect(() => {
    if (markerCoords) {
      setCurrentCoords(markerCoords);
    } else {
      setCurrentCoords(INITIAL_REGION);
    }
  }, []);

  if (error) {
    return <ErrorText error={error} />;
  }

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color="#51bbfe"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
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
