import { useRouter } from "expo-router";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  clearData,
  clearError,
  setCoordinatesAndFetchAddress,
  setMapMarkerCoordinates,
  setRegisterLocationWithMap,
} from "../store/slices/locationAndMapSlice";
import { useState, useEffect, useCallback, useMemo } from "react";
import ErrorText from "./UI/ErrorText";
import { MyLightTheme } from "../assets/theme/global";
import LoadingScreen from "./UI/LoadingScreen";
import { showToast } from "../utils/showToast";
import CustomAlert from "./UI/CustomAlert";
import { getRegionName } from "../store/utils/locationUtils";

const INITIAL_COORDS = {
  latitude: 50.4501,
  longitude: 30.5234,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

export default function Map({ forRegister }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { markerCoords, isLoading, error } = useSelector(
    (state) => state.location
  );

  const [currentCoords, setCurrentCoords] = useState(null);
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [locationAlert, setLocationAlert] = useState({
    show: false,
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const closeErrorAlert = () => setShowErrorAlert(false);

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
    clearError();

    setTimeout(async () => {
      try {
        dispatch(clearData());
        setCurrentCoords(INITIAL_COORDS);
      } catch (error) {
        showToast("error", "Не вдалося оновити дані карти.");
      } finally {
        setRefreshing(false);
      }
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    clearError();
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
      setShowErrorAlert(false);

      const region = await getRegionName(
        currentCoords.latitude,
        currentCoords.longitude
      );

      if (region) {
        dispatch(setMapMarkerCoordinates(currentCoords));

        let result;
        if (forRegister) {
          result = await dispatch(
            setRegisterLocationWithMap({
              ...currentCoords,
              regionName: region,
            })
          ).unwrap();
        } else {
          result = await dispatch(
            setCoordinatesAndFetchAddress({
              ...currentCoords,
              regionName: region,
            })
          ).unwrap();
        }

        if (result) {
          setLocationAlert({
            show: true,
            message: `Широта: ${result?.latitude}, \nДовгота: ${result?.longitude}, \nВаша область: ${result?.regionName}`,
            onConfirm: () => {
              setLocationAlert((prev) => ({
                ...prev,
                show: false,
              }));
              router.back();
            },
            onCancel: () => {
              setLocationAlert(() => ({ ...locationAlert, show: false }));
            },
          });
        }
      } else {
        setShowErrorAlert(true);
        return;
      }
    } catch (err) {
      showToast("error", "Не вдалося зберегти місцезнаходження.");
    } finally {
      setIsSavingLocation(false);
    }
  }, [currentCoords, router, dispatch, locationAlert, forRegister]);

  if (!currentCoords) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <>
        {!error && (
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
              onDragEnd={(e) => {
                const newCoords = {
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                };
                if (
                  newCoords.latitude !== currentCoords.latitude ||
                  newCoords.longitude !== currentCoords.longitude
                ) {
                  setCurrentCoords({ ...currentCoords, ...newCoords });
                }
              }}
            />
          </MapView>
        )}

        {error && (
          <View style={styles.loadingOverlay}>
            <ErrorText error={error} />
          </View>
        )}

        {(isLoading || isSavingLocation || refreshing) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={MyLightTheme.colors.white} />
            <Text style={styles.loadingText}>Завантаження...</Text>
          </View>
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
        <FAB
          onPress={onRefresh}
          icon={"reload"}
          style={styles.reloadBtn}
          customSize={46}
        />
        {showErrorAlert && (
          <CustomAlert
            showAlert={showErrorAlert}
            title={"Помилка"}
            message={
              "Не вдалося визначити область для заданих координат. Будь ласка, перевірте, чи відповідає розташування прапорця на карті одній з області України."
            }
            onConfirm={closeErrorAlert}
          />
        )}
        {locationAlert.show && (
          <CustomAlert
            showAlert={locationAlert.show}
            title={"Ваше місцезнаходження"}
            message={locationAlert.message}
            showCancelButton
            onConfirm={() => {
              if (locationAlert.onConfirm) {
                locationAlert.onConfirm();
              }
            }}
            onCancel={() => {
              if (locationAlert.onCancel) {
                locationAlert.onCancel();
              }
            }}
          />
        )}
      </>
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
    backgroundColor: MyLightTheme.colors.white,
    borderWidth: 3,
    borderColor: MyLightTheme.colors.greenDark,
  },
  btnBack: {
    left: 0,
    position: "absolute",
    top: 0,
    margin: 16,
    marginTop: 19,
    backgroundColor: MyLightTheme.colors.white,
  },
  reloadBtn: {
    right: 0,
    position: "absolute",
    bottom: 0,
    margin: 16,
    backgroundColor: MyLightTheme.colors.white,
    borderWidth: 3,
    borderColor: MyLightTheme.colors.primaryDark,
  },
  marker: {
    width: 50,
    height: 50,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: MyLightTheme.colors.darkTransparent,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: MyLightTheme.colors.white,
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
});
