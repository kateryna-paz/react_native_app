import * as Location from "expo-location";
import { regionsUkr } from "../../constants/ukrainianRegions";

export const getRegionName = async (latitude, longitude) => {
  if (
    latitude >= 44.3864 &&
    latitude <= 46.1927 &&
    longitude >= 32.4919 &&
    longitude <= 36.6209
  ) {
    return "Автономна Республіка Крим";
  }

  const address = await Location.reverseGeocodeAsync({ latitude, longitude });
  if (!address || address.length === 0) {
    throw new Error("Не вдалося визначити область для заданих координат.");
  }

  const { region } = address[0] || {};
  return regionsUkr[region] || null;
};

export const requestLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error(
      "Дозвіл на використання геолокації не надано. Будь ласка увімкніть геолокацію або у Налаштуваннях дайте дозвіл на використання геолокації додатку SolarManager."
    );
  }
  return status === "granted";
};

export const getCurrentPosition = async () => {
  const { coords } = await Location.getCurrentPositionAsync();
  return coords;
};
