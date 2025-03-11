import { create } from "zustand";
import { asyncStorage } from "../services/asyncStorageService";
import {
  getCurrentPosition,
  getRegionName,
  requestLocationPermission,
} from "./utils/locationUtils";
import { ensureAuthenticated } from "./utils/authUtils";
import { locationsApi } from "../services/apis/locations";
import { getErrorMessage } from "./utils/errorHandler";
import useAuthStore from "./authStore";
import useWeatherStore from "./weatherStore";

const useLocationStore = create(
  (set, get) => ({
    location: null,
    markerCoords: {
      latitude: 50.4501,
      longitude: 30.5234,
      latitudeDelta: 20,
      longitudeDelta: 20,
    },
    registerLocation: null,
    permission: false,
    isLoading: false,
    error: null,

    clearData: () =>
      set({
        location: null,
        markerCoords: {
          latitude: 50.4501,
          longitude: 30.5234,
          latitudeDelta: 20,
          longitudeDelta: 20,
        },
        error: null,
        isLoading: false,
      }),

    clearError: () => set({ error: null }),

    getLocationWithGeo: async () => {
      try {
        set({ isLoading: true, error: null });

        const { clearWeatherData } = useWeatherStore.getState();

        await requestLocationPermission();
        const { latitude, longitude } = await getCurrentPosition();
        const regionInUkrainian = await getRegionName(latitude, longitude);
        const userId = ensureAuthenticated(useAuthStore.getState);

        const existingLocation = await locationsApi.getUserLocation(userId);
        let location;

        if (existingLocation?.id) {
          const today = new Date().toISOString().split("T")[0];
          const updatedDailyEnergy =
            existingLocation.dailyEnergyProduced?.filter(
              (entry) => !entry.date.startsWith(today)
            ) || [];

          location = await locationsApi.updateLocation(existingLocation.id, {
            userId,
            coordinates: [latitude, longitude],
            regionName: regionInUkrainian,
            dailyEnergyProduced: updatedDailyEnergy,
          });

          clearWeatherData();
        } else {
          location = await locationsApi.createLocation({
            userId,
            coordinates: [latitude, longitude],
            regionName: regionInUkrainian,
          });
        }

        set({
          location: locationsApi.transformLocationData(location),
          markerCoords: {
            latitude,
            longitude,
            latitudeDelta: 20,
            longitudeDelta: 20,
          },
          isLoading: false,
        });
      } catch (error) {
        set({
          error: getErrorMessage(
            error,
            "Сталася помилка при отриманні місцезнаходження."
          ),
          isLoading: false,
        });
      }
    },

    setCoordinatesAndFetchAddress: async ({
      latitude,
      longitude,
      regionName,
    }) => {
      try {
        set({ isLoading: true, error: null });

        const { clearWeatherData } = useWeatherStore.getState();

        if (!regionName) {
          throw new Error(
            "Не вдалося визначити область для заданих координат."
          );
        }

        const userId = ensureAuthenticated(useAuthStore.getState);
        const existingLocation = await locationsApi.getUserLocation(userId);
        let location;

        if (!existingLocation?.id) {
          location = await locationsApi.createLocation({
            userId,
            coordinates: [latitude, longitude],
            regionName,
          });
        } else {
          const today = new Date().toISOString().split("T")[0];
          const updatedDailyEnergy =
            existingLocation.dailyEnergyProduced?.filter(
              (entry) => !entry.date.startsWith(today)
            ) || [];

          location = await locationsApi.updateLocation(existingLocation.id, {
            userId,
            coordinates: [latitude, longitude],
            regionName,
            dailyEnergyProduced: updatedDailyEnergy,
          });

          clearWeatherData();
        }

        set({
          location: locationsApi.transformLocationData(location),
          isLoading: false,
        });
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    addLocation: async () => {
      try {
        set({ isLoading: true, error: null });

        const loc = get().registerLocation;
        if (!loc) {
          throw new Error("Місцезнаходження невдалося визначити.");
        }

        const userId = ensureAuthenticated(useAuthStore.getState);
        const location = await locationsApi.createLocation({
          userId,
          coordinates: [loc.latitude, loc.longitude],
          regionName: loc.regionName,
        });

        set({
          location: locationsApi.transformLocationData(location),
          registerLocation: null,
          isLoading: false,
        });
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    setMapMarkerCoordinates: ({ latitude, longitude }) => {
      set({
        markerCoords: {
          latitude,
          longitude,
          latitudeDelta: 20,
          longitudeDelta: 20,
        },
      });
    },

    setPermission: async () => {
      try {
        set({ isLoading: true, error: null });

        const isGranted = await requestLocationPermission();
        set({ permission: isGranted, isLoading: false });
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    fetchLocation: async () => {
      try {
        set({ isLoading: true, error: null });

        const userId = ensureAuthenticated(useAuthStore.getState);
        const location = await locationsApi.getUserLocation(userId);

        set({
          location: locationsApi.transformLocationData(location),
          isLoading: false,
        });
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      } finally {
        set({ isLoading: false });
      }
    },

    setRegisterLocationWithGeo: async () => {
      try {
        set({ isLoading: true, error: null });

        await requestLocationPermission();
        const { latitude, longitude } = await getCurrentPosition();
        const regionInUkrainian = await getRegionName(latitude, longitude);

        set({
          registerLocation: {
            latitude,
            longitude,
            regionName: regionInUkrainian,
          },
          isLoading: false,
        });
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    setRegisterLocationWithMap: ({ latitude, longitude, regionName }) => {
      try {
        set({ registerLocation: { latitude, longitude, regionName } });
      } catch (error) {
        set({ error: getErrorMessage(error) });
      }
    },

    updateDailyEnergyArray: async (
      energyAmount,
      hourlyEnergyArray,
      isEnergyChanged
    ) => {
      const { location } = get();
      const userId = ensureAuthenticated(useAuthStore.getState);

      if (!location) {
        set({ error: "Локацію не знайдено." });
        return;
      }

      try {
        const existingEntries = location.dailyEnergyProduced;

        set({ error: null });

        let updatedArray = Array.from(existingEntries);
        const today = new Date().toISOString().split("T")[0];

        if (!energyAmount && !hourlyEnergyArray) {
          updatedArray =
            existingEntries?.filter((entry) => !entry.date.startsWith(today)) ||
            [];
        } else {
          const todayEntryIndex = existingEntries.findIndex((entry) =>
            entry.date.startsWith(today)
          );

          const newEntry = {
            date: new Date().toISOString(),
            energy: energyAmount,
            hourlyEnergy: hourlyEnergyArray,
          };

          if (todayEntryIndex !== -1) {
            const existingEntry = existingEntries[todayEntryIndex];

            const shouldUpdate =
              isEnergyChanged ||
              existingEntry.energy !== energyAmount ||
              JSON.stringify(existingEntry.hourlyEnergy) !==
                JSON.stringify(hourlyEnergyArray);

            if (shouldUpdate) {
              updatedArray[todayEntryIndex] = newEntry;
            } else {
              return;
            }
          } else {
            updatedArray.push(newEntry);
          }
        }

        if (JSON.stringify(existingEntries) === JSON.stringify(updatedArray)) {
          return;
        }

        const updatedLocation = await locationsApi.updateLocation(location.id, {
          userId: userId,
          coordinates: [location.latitude, location.longitude],
          regionName: location.regionName,
          dailyEnergyProduced: updatedArray,
        });

        set({
          location: locationsApi.transformLocationData(updatedLocation),
        });
      } catch (error) {
        set({ error: getErrorMessage(error) });
      }
    },
  }),
  {
    name: "location-storage",
    storage: {
      getItem: async (name) => {
        const data = await asyncStorage.getData(name);
        return data ? JSON.parse(data) : null;
      },
      setItem: async (name, value) => {
        await asyncStorage.setData(name, JSON.stringify(value));
      },
      removeItem: async (name) => {
        await asyncStorage.removeData(name);
      },
    },
  }
);

export default useLocationStore;
