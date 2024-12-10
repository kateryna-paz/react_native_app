import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const weatherKey = process.env.EXPO_PUBLIC_WETHER_KEY;

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { latitude, longitude } = state.location?.location;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=1&appid=${weatherKey}&units=metric`
      );

      if (!response.ok) {
        return rejectWithValue(`HTTP error! ${response.message}`);
      }

      const data = await response.json();

      if (!data) {
        return rejectWithValue("Не вдалося отримати дані погоди.");
      }

      const cloudiness = data?.list[0].clouds.all;
      const totalSeconds = data.city.sunset - data.city.sunrise;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      const sunDayHours = +`${hours}.${minutes}`;

      return {
        cloudiness,
        sunDayHours,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weatherData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.isLoading = false;
        state.weatherData = { ...action.payload };
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default weatherSlice.reducer;
