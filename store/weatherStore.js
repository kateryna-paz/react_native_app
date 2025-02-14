import { create } from "zustand";
import useLocationStore from "./locationAndMapStore";
import { fetchWeatherData, formatWeatherData } from "../services/apis/weather";
import { getErrorMessage } from "./utils/errorHandler";
import { asyncStorage } from "../services/asyncStorageService";

const useWeatherStore = create(
  (set, _) => ({
    weatherData: null,
    isLoading: false,
    error: null,

    fetchWeather: async () => {
      set({ isLoading: true, error: null });

      try {
        const { location } = useLocationStore.getState();

        if (!location?.latitude || !location?.longitude) {
          return;
        }

        const weatherData = await fetchWeatherData(
          location.latitude,
          location.longitude
        );
        set({ weatherData: formatWeatherData(weatherData) });
      } catch (error) {
        set({ error: getErrorMessage(error) });
      } finally {
        set({ isLoading: false });
      }
    },

    resetWeatherError: () => set({ error: null }),

    clearWeatherData: () => set({ weatherData: null, error: null }),
  }),
  {
    name: "weather-storage",
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

export default useWeatherStore;
