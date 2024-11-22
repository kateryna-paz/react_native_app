import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";

export const fetchLocation = createAsyncThunk(
  "location/fetchLocation",
  async (_, { rejectWithValue }) => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return rejectWithValue(
            "Геолокація вимкнена. Увімкніть її у налаштуваннях."
          );
        }
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return rejectWithValue("Дозвіл на використання геолокації не надано.");
      }

      const { coords } = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = coords;

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (!address || address.length === 0) {
        return rejectWithValue("Не вдалося знайти вашу адресу.");
      }

      const { region, city } = address[0];

      return {
        latitude,
        longitude,
        city,
        region,
      };
    } catch (error) {
      return rejectWithValue("Сталася помилка при отриманні місцезнаходження.");
    }
  }
);

export const setCoordinatesAndFetchAddress = createAsyncThunk(
  "location/setCoordinatesAndFetchAddress",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      console.log(latitude, longitude);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        rejectWithValue("Доступ до локації не надано");
      }

      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (!address || address.length === 0) {
        return rejectWithValue(
          "Не вдалося знайти адресу для заданих координат."
        );
      }

      const { region, city } = address[0];

      return {
        latitude,
        longitude,
        city,
        region,
      };
    } catch (error) {
      return rejectWithValue("Помилка при визначенні адреси.");
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    location: {
      latitude: null,
      longitude: null,
      region: null,
      city: null,
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
      })
      .addCase(setCoordinatesAndFetchAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setCoordinatesAndFetchAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.location = { ...action.payload };
        state.error = null;
      })
      .addCase(setCoordinatesAndFetchAddress.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export default locationSlice.reducer;
