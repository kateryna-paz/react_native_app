import { useRouter } from "expo-router";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ActivityIndicator, FAB, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  clearData,
  getRegionName,
  setCoordinatesAndFetchAddress,
  setMapMarkerCoordinates,
  setRegisterLocationWithMap,
} from "../store/slices/locationAndMapSlice";
import { useState, useEffect, useCallback, useMemo } from "react";
import ErrorText from "./UI/ErrorText";
import { MyLightTheme } from "../assets/theme/global";
import LoadingScreen from "./UI/LoadingScreen";
import BackButton from "./UI/BackButton";

const INITIAL_COORDS = {
  latitude: 50.4501,
  longitude: 30.5234,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

export default function Map({ forRegister }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { params } = router;
  const onSaveLocation = params?.onSaveLocation;

  const { markerCoords, location, isLoading, error } = useSelector(
    (state) => state.location
  );

  const [currentCoords, setCurrentCoords] = useState(null);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const finalCoords = useMemo(() => {
    if (markerCoords && markerCoords.latitude && markerCoords.longitude) {
      return {
        latitude: markerCoords.latitude,
        longitude: markerCoords.longitude,
        latitudeDelta: markerCoords.latitudeDelta || 25,
        longitudeDelta: markerCoords.longitudeDelta || 25,
      };
    }
    return INITIAL_COORDS;
  }, [markerCoords]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(async () => {
      try {
        dispatch(clearData());
        setCurrentCoords(INITIAL_COORDS);
      } catch (error) {
        Alert.alert("Помилка", "Не вдалося оновити дані карти.");
      } finally {
        setRefreshing(false);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (!currentCoords) {
      setCurrentCoords(finalCoords);
    }
  }, [finalCoords, currentCoords]);

  const onRegionChangeComplete = (region) => {
    setCurrentCoords(region);
  };

  const saveLocation = useCallback(async () => {
    try {
      setIsSavingLocation(true);

      const region = await getRegionName(
        currentCoords.latitude,
        currentCoords.longitude
      );

      console.log("region: " + region);

      if (!region) {
        Alert.alert(
          "Помилка",
          "Не вдалося визначити область для заданих координат. Будь ласка, перевірте, чи відповідає розташування прапорця на карті одній з області України."
        );
        return;
      }

      await dispatch(setMapMarkerCoordinates(currentCoords));
      let result;
      if (forRegister) {
        result = await dispatch(
          setRegisterLocationWithMap({ ...currentCoords, regionName: region })
        ).unwrap();
      } else {
        result = await dispatch(
          setCoordinatesAndFetchAddress({
            ...currentCoords,
            regionName: region,
          })
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
    } finally {
      setIsSavingLocation(false);
    }
  }, [currentCoords, onSaveLocation, router]);

  if (error) {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <BackButton
          stylesBtn={styles.btnBack}
          iconColor={theme.colors.accent}
        />
        <ErrorText error={error} />
      </ScrollView>
    );
  }

  if (isLoading || isSavingLocation || !currentCoords) {
    return (
      <LoadingScreen
        colorStart={theme.colors.secondaryDark}
        colorEnd={theme.colors.secondaryLight}
        indicatorColor={theme.colors.white}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {currentCoords && (
        <MapView
          style={styles.map}
          onRegionChangeComplete={onRegionChangeComplete}
          initialRegion={currentCoords}
          region={currentCoords}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={{
              latitude: currentCoords.latitude,
              longitude: currentCoords.longitude,
            }}
            title="Your Location"
            style={styles.marker}
            draggable
            onDragEnd={(e) =>
              setCurrentCoords({
                ...currentCoords,
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude,
              })
            }
          />
        </MapView>
      )}
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
    borderColor: MyLightTheme.colors.greenDark,
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
