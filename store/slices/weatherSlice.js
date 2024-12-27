import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const weatherKey = process.env.EXPO_PUBLIC_WETHER_KEY;
const weatherApiKey = process.env.EXPO_PUBLIC_WETHER_API_KEY;

function calculateDaylight(sunrise, sunset) {
  const toMinutes = (time) => {
    const [hours, minutesPart] = time.split(":");
    const minutes = parseInt(minutesPart, 10);
    const isPM = time.includes("PM");
    let totalHours = parseInt(hours, 10);
    if (isPM && totalHours !== 12) totalHours += 12;
    if (!isPM && totalHours === 12) totalHours = 0;
    return totalHours * 60 + minutes;
  };

  const sunriseMinutes = toMinutes(sunrise);
  const sunsetMinutes = toMinutes(sunset);
  const totalDaylightMinutes = sunsetMinutes - sunriseMinutes;

  const hours = Math.floor(totalDaylightMinutes / 60);
  let minutes = totalDaylightMinutes % 60;
  if (minutes < 10) minutes = `0${minutes}`;

  return { hours, minutes };
}

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const { latitude, longitude } = state.location?.location;

      const weatherRes = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
      );

      if (!weatherRes.ok) {
        return rejectWithValue("Не вдалося отримати дані погоди.");
      }

      const weatherData = await weatherRes?.json();

      const sunrise = weatherData.forecast?.forecastday[0]?.astro?.sunrise;
      const sunset = weatherData.forecast?.forecastday[0]?.astro?.sunset;
      const sunsetHours = +sunset.split(":")[0] + 12;
      const sunsetTime = `${sunsetHours}:${sunset.split(":")[1]}`.split(" ")[0];
      const daylight = calculateDaylight(sunrise, sunset);
      const sunDayHours = `${daylight.hours}.${daylight.minutes}`;
      console.log("Daylight:", daylight);

      const cloudiness = weatherData.forecast?.forecastday[0]?.hour[0]?.cloud;
      const forecastHours = weatherData.forecast?.forecastday[0]?.hour;

      if (!forecastHours) {
        return rejectWithValue("Не вдалося отримати дані погоди.");
      }
      const hourlyClouds = forecastHours.map((hour) => hour.cloud);

      return {
        cloudiness,
        sunDayHours,
        hourlyClouds,
        sunrise: sunrise.split(" ")[0],
        sunset: sunsetTime,
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
