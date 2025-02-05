import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../utils/errorHandler";
import { locationsApi } from "../../services/apis/locations";
import {
  getCurrentPosition,
  getRegionName,
  requestLocationPermission,
} from "../utils/locationUtils";
import { ensureAuthenticated } from "../utils/authUtils";

export const getLocationWithGeo = createAsyncThunk(
  "locationAndMap/getLocationWithGeo",
  async (_, { rejectWithValue, getState }) => {
    try {
      await requestLocationPermission();
      const { latitude, longitude } = await getCurrentPosition();
      const regionInUkrainian = await getRegionName(latitude, longitude);

      const userId = ensureAuthenticated(getState);

      const existingLocation = await locationsApi.getUserLocation(userId);
      let location;

      if (existingLocation?.id) {
        location = await locationsApi.updateLocation(existingLocation.id, {
          userId,
          coordinates: [latitude, longitude],
          regionName: regionInUkrainian,
        });
      } else {
        location = await locationsApi.createLocation({
          userId,
          coordinates: [latitude, longitude],
          regionName: regionInUkrainian,
        });
      }

      return locationsApi.transformLocationData(location);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(
          error,
          "Сталася помилка при отриманні місцезнаходження."
        )
      );
    }
  }
);
export const setCoordinatesAndFetchAddress = createAsyncThunk(
  "locationAndMap/setCoordinatesAndFetchAddress",
  async (
    { latitude, longitude, regionName },
    { rejectWithValue, getState }
  ) => {
    try {
      if (!regionName) {
        return rejectWithValue(
          "Не вдалося визначити область для заданих координат."
        );
      }

      const userId = ensureAuthenticated(getState);

      const existingLocation = await locationsApi.getUserLocation(userId);
      let location;

      if (!existingLocation?.id) {
        location = await locationsApi.createLocation({
          userId,
          coordinates: [latitude, longitude],
          regionName,
        });
      } else {
        location = await locationsApi.updateLocation(existingLocation.id, {
          userId,
          coordinates: [latitude, longitude],
          regionName,
        });
      }

      return locationsApi.transformLocationData(location);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
export const addLocation = createAsyncThunk(
  "locationAndMap/addLocation",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();

      const loc = state.location.registerLocation;

      if (!loc) {
        return rejectWithValue("Місцезнаходження невдалося визначити.");
      }

      const userId = ensureAuthenticated(getState);

      const location = await locationsApi.createLocation({
        userId,
        coordinates: [loc.latitude, loc.longitude],
        regionName: loc.regionName,
      });

      return locationsApi.transformLocationData(location);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const setMapMarkerCoordinates = createAsyncThunk(
  "locationAndMap/setMapMarkerCoordinates",
  async (
    { latitude, longitude, latitudeDelta, longitudeDelta },
    { rejectWithValue }
  ) => {
    try {
      return {
        latitude,
        longitude,
        latitudeDelta: latitudeDelta || 10,
        longitudeDelta: longitudeDelta || 10,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const setPermission = createAsyncThunk(
  "location/setPermission",
  async (_, { rejectWithValue }) => {
    try {
      const isGranted = await requestLocationPermission();
      return isGranted;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = ensureAuthenticated(getState);

      const location = await locationsApi.getUserLocation(userId);
      if (!location?.id) {
        return null;
      }

      return locationsApi.transformLocationData(location);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const setRegisterLocationWithGeo = createAsyncThunk(
  "location/setRegisterLocationWithGeo",
  async (_, { rejectWithValue }) => {
    try {
      await requestLocationPermission();
      const { latitude, longitude } = await getCurrentPosition();
      const regionInUkrainian = await getRegionName(latitude, longitude);

      return {
        latitude,
        longitude,
        regionName: regionInUkrainian,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const setRegisterLocationWithMap = createAsyncThunk(
  "location/setRegisterLocationWithMap",
  async ({ latitude, longitude, regionName }, { rejectWithValue }) => {
    try {
      return { latitude, longitude, regionName };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  location: null,
  markerCoords: null,
  registerLocation: null,
  permission: false,
  isLoading: false,
  error: null,
};

const locationAndMapSlice = createSlice({
  name: "locationAndMap",
  initialState,
  reducers: {
    clearData(state) {
      state.error = null;
      state.location = null;
      state.markerCoords = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.isLoading = true;
      state.error = null;
    };

    const setRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    const setFulfilled = (state) => {
      state.isLoading = false;
      state.error = null;
    };

    builder
      .addCase(getLocationWithGeo.pending, setPending)
      .addCase(getLocationWithGeo.fulfilled, (state, action) => {
        setFulfilled(state);
        state.location = action.payload;
      })
      .addCase(getLocationWithGeo.rejected, setRejected)

      .addCase(setCoordinatesAndFetchAddress.pending, setPending)
      .addCase(setCoordinatesAndFetchAddress.fulfilled, (state, action) => {
        setFulfilled(state);
        state.location = action.payload;
        state.markerCoords = {
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
          latitudeDelta: 20,
          longitudeDelta: 20,
        };
      })
      .addCase(setCoordinatesAndFetchAddress.rejected, setRejected)

      .addCase(addLocation.pending, setPending)
      .addCase(addLocation.fulfilled, (state, action) => {
        setFulfilled(state);
        state.location = action.payload;
        state.registerLocation = null;
      })
      .addCase(addLocation.rejected, setRejected)

      .addCase(setRegisterLocationWithGeo.pending, setPending)
      .addCase(setRegisterLocationWithGeo.fulfilled, (state, action) => {
        setFulfilled(state);
        state.registerLocation = action.payload;
      })
      .addCase(setRegisterLocationWithGeo.rejected, setRejected)

      .addCase(setRegisterLocationWithMap.pending, setPending)
      .addCase(setRegisterLocationWithMap.fulfilled, (state, action) => {
        setFulfilled(state);
        state.registerLocation = action.payload;
      })
      .addCase(setRegisterLocationWithMap.rejected, setRejected)

      .addCase(fetchLocation.pending, setPending)
      .addCase(fetchLocation.fulfilled, (state, action) => {
        setFulfilled(state);
        state.location = action.payload;
      })
      .addCase(fetchLocation.rejected, setRejected)

      .addCase(setMapMarkerCoordinates.pending, setPending)
      .addCase(setMapMarkerCoordinates.fulfilled, (state, action) => {
        setFulfilled(state);
        state.markerCoords = {
          ...action.payload,
          latitudeDelta: action.payload.latitudeDelta || 10,
          longitudeDelta: action.payload.longitudeDelta || 10,
        };
      })
      .addCase(setMapMarkerCoordinates.rejected, setRejected)

      .addCase(setPermission.pending, setPending)
      .addCase(setPermission.fulfilled, (state, action) => {
        setFulfilled(state);
        state.permission = action.payload;
      })
      .addCase(setPermission.rejected, setRejected);
  },
});

export const { clearData, clearError } = locationAndMapSlice.actions;

export default locationAndMapSlice.reducer;
