import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchWeatherData,
  formatWeatherData,
} from "../../services/apis/weather";
import { getErrorMessage } from "../utils/errorHandler";

const initialState = {
  weatherData: null,
  isLoading: false,
  error: null,
};

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { location } = state.location;

      if (!location?.latitude || !location?.longitude) {
        throw new Error("Location not available");
      }

      const weatherData = await fetchWeatherData(
        location.latitude,
        location.longitude
      );

      return formatWeatherData(weatherData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    resetWeatherError: (state) => {
      state.error = null;
    },
    clearWeatherData: (state) => {
      state.weatherData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weatherData = action.payload;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetWeatherError, clearWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer;
