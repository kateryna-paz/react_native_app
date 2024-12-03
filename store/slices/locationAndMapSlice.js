import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";
import { regionsUkr } from "../../constants/ukrainianRegions";
import axiosInstance from "../../services/axiosConfig";

const getRegionName = async (latitude, longitude) => {
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
  return regionsUkr[region] || region || "Невідома область";
};

export const getLocationWithGeo = createAsyncThunk(
  "locationAndMap/getLocationWithGeo",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return rejectWithValue("Дозвіл на використання геолокації не надано.");
      }

      const { coords } = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = coords;

      const regionInUkrainian = await getRegionName(latitude, longitude);

      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue(
          " Помилка при отриманні даних, користувач не визначений."
        );
      }
      const loc = await axiosInstance.get(`/locations/userId/${userId}`);

      let location;

      if (loc.data?.id) {
        location = await axiosInstance.put(`/locations/${loc.data.id}`, {
          userId,
          coordinates: [latitude, longitude],
          regionName: regionInUkrainian,
        });
      } else {
        location = await axiosInstance.post(`/locations`, {
          userId,
          coordinates: [latitude, longitude],
          regionName: regionInUkrainian,
          dailyEnergyProduced: [],
        });
      }

      const transformedData = {
        id: location.data.id,
        latitude: location.data.coordinates[0],
        longitude: location.data.coordinates[1],
        dailyEnergyProduced: location.data.dailyEnergyProduced,
        regionId: location.data.regionId.id,
        regionName: location.data.regionId.name,
        monthlyInsolation: location.data.regionId.monthlyInsolation,
        yearlyInsolation: location.data.regionId.yearlyInsolation,
      };

      console.log(transformedData);

      return transformedData;
    } catch (error) {
      return rejectWithValue("Сталася помилка при отриманні місцезнаходження.");
    }
  }
);

export const setCoordinatesAndFetchAddress = createAsyncThunk(
  "locationAndMap/setCoordinatesAndFetchAddress",
  async ({ latitude, longitude }, { rejectWithValue, getState }) => {
    try {
      const regionInUkrainian = await getRegionName(latitude, longitude);

      console.log(regionInUkrainian);

      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue(
          " Помилка при отриманні даних, користувач не визначений."
        );
      }
      const loc = await axiosInstance.get(`/locations/userId/${userId}`);

      let location;

      if (loc.data.id) {
        location = await axiosInstance.put(`/locations/${loc.data.id}`, {
          userId,
          coordinates: [latitude, longitude],
          regionName: regionInUkrainian,
        });
      } else {
        location = await axiosInstance.post(`/locations`, {
          userId,
          coordinates: [latitude, longitude],
          regionName: regionInUkrainian,
          dailyEnergyProduced: [],
        });
      }

      const transformedData = {
        id: location.data.id,
        latitude: location.data.coordinates[0],
        longitude: location.data.coordinates[1],
        dailyEnergyProduced: location.data.dailyEnergyProduced,
        regionId: location.data.regionId.id,
        regionName: location.data.regionId.name,
        monthlyInsolation: location.data.regionId.monthlyInsolation,
        yearlyInsolation: location.data.regionId.yearlyInsolation,
      };

      console.log(transformedData);

      return transformedData;
    } catch (error) {
      return rejectWithValue("Помилка при визначенні адреси. " + error);
    }
  }
);

export const addLocation = createAsyncThunk(
  "locationAndMap/addLocation",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      const loc = state.location.registerLocation;

      if (!userId) {
        return rejectWithValue(
          " Помилка при отриманні даних, користувач не визначений."
        );
      }

      const location = await axiosInstance.post(`/locations`, {
        userId,
        coordinates: [loc.latitude, loc.longitude],
        regionName: loc.regionName,
        dailyEnergyProduced: [],
      });

      const transformedData = {
        id: location.data.id,
        latitude: location.data.coordinates[0],
        longitude: location.data.coordinates[1],
        dailyEnergyProduced: location.data.dailyEnergyProduced,
        regionId: location.data.regionId.id,
        regionName: location.data.regionId.name,
        monthlyInsolation: location.data.regionId.monthlyInsolation,
        yearlyInsolation: location.data.regionId.yearlyInsolation,
      };

      console.log(transformedData);

      return transformedData;
    } catch (error) {
      return rejectWithValue(
        "Помилка при додаванні місцезнаходження. " + error
      );
    }
  }
);

export const setMapMarkerCoordinates = createAsyncThunk(
  "locationAndMap/setMapMarkerCoordinates",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      return { latitude, longitude };
    } catch (error) {
      return rejectWithValue("Помилка при визначенні локації. " + error);
    }
  }
);

export const setPermission = createAsyncThunk(
  "location/setPermission",
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      console.log("status " + status);
      if (status === "granted") {
        return true;
      } else {
        return rejectWithValue(
          "Дозвіл на використання геолокації не надано. Будь ласка увімкніть геолокацію або у Налаштуваннях дайте дозвіл на використання геолокації додатку SolarManager."
        );
      }
    } catch (error) {
      return rejectWithValue(
        "Сталася помилка при отриманні дозволу на використання геолокації. Будь ласка увімкніть геолокацію або у Налаштуваннях дайте дозвіл на використання геолокації додатку SolarManager."
      );
    }
  }
);

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue(
          " Помилка при отриманні даних, користувач не визначений."
        );
      }
      const loc = await axiosInstance.get(`/locations/userId/${userId}`);

      if (!loc.data) {
        return null;
      }

      const transformedData = {
        id: loc.data.id,
        latitude: loc.data.coordinates[0],
        longitude: loc.data.coordinates[1],
        dailyEnergyProduced: loc.data.dailyEnergyProduced,
        regionId: loc.data.regionId.id,
        regionName: loc.data.regionId.name,
        monthlyInsolation: loc.data.regionId.monthlyInsolation,
        yearlyInsolation: loc.data.regionId.yearlyInsolation,
      };

      return transformedData;
    } catch (error) {
      return rejectWithValue("Error fetching location: " + error.message);
    }
  }
);

export const setRegisterLocationWithGeo = createAsyncThunk(
  "location/setRegisterLocationWithGeo",
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return rejectWithValue("Дозвіл на використання геолокації не надано.");
      }

      const { coords } = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = coords;

      const regionInUkrainian = await getRegionName(latitude, longitude);

      return { latitude, longitude, regionName: regionInUkrainian };
    } catch (error) {
      return rejectWithValue(
        "Сталася помилка при визначенні місцезнаходження."
      );
    }
  }
);

export const setRegisterLocationWithMap = createAsyncThunk(
  "location/setRegisterLocationWithMap",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      const regionInUkrainian = await getRegionName(latitude, longitude);

      return { latitude, longitude, regionName: regionInUkrainian };
    } catch (error) {
      return rejectWithValue(
        "Сталася помилка при визначенні місцезнаходження."
      );
    }
  }
);

const locationAndMapSlice = createSlice({
  name: "locationAndMap",
  initialState: {
    location: null,
    markerCoords: {
      latitude: 48.5336,
      longitude: 32.6369,
      latitudeDelta: 25,
      longitudeDelta: 25,
    },
    registerLocation: null,
    permission: false,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.location = { ...action.payload };
        state.registerLocation = null;
        state.error = null;
      })
      .addCase(addLocation.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setRegisterLocationWithGeo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registerLocation = { ...action.payload };
        state.error = null;
      })
      .addCase(setRegisterLocationWithGeo.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setRegisterLocationWithGeo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setRegisterLocationWithMap.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registerLocation = { ...action.payload };
        console.log(state.registerLocation);
        state.error = null;
      })
      .addCase(getLocationWithGeo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLocationWithGeo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.location = { ...action.payload };
        state.error = null;
      })
      .addCase(getLocationWithGeo.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.location = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(setCoordinatesAndFetchAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setCoordinatesAndFetchAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.location = { ...action.payload };
        state.markerCoords = {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        };
        state.error = null;
      })
      .addCase(setCoordinatesAndFetchAddress.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(setMapMarkerCoordinates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setMapMarkerCoordinates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.markerCoords = { ...action.payload };
        state.error = null;
      })
      .addCase(setMapMarkerCoordinates.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(setPermission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setPermission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.permission = { ...action.payload };
        state.error = null;
      })
      .addCase(setPermission.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default locationAndMapSlice.reducer;