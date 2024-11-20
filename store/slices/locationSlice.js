import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async (_, { rejectWithValue }) => {
    try {
      // Step 1: Check if location services are enabled
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        return rejectWithValue(
          "Геолокація вимкнена. Увімкніть її у налаштуваннях."
        );
      }

      // Step 2: Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return rejectWithValue("Дозвіл на використання геолокації не надано.");
      }

      // Step 3: Get user's location
      const { coords } = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = coords;

      // Step 4: Reverse geocode the location
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (!address || address.length === 0) {
        return rejectWithValue("Не вдалося знайти вашу адресу.");
      }

      const { country, city, region, street, streetNumber } = address[0];

      return {
        latitude,
        longitude,
        country,
        city,
        region,
        street,
        house: streetNumber,
      };
    } catch (error) {
      console.error("Error fetching location:", error);
      return rejectWithValue("Сталася помилка при отриманні місцезнаходження.");
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    location: {
      latitude: null,
      longitude: null,
      country: null,
      region: null,
      city: null,
      street: null,
      house: null,
    },

    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.location = { ...action.payload };
        state.error = null;
      })
      .addCase(fetchLocation.rejected, (state, action) => {
        state.error = action.payload;

        state.isLoading = false;
      });
  },
});

export default locationSlice.reducer;
