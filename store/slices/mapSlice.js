import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setMapMarkerCoordinates = createAsyncThunk(
  "map/setMapMarkerCoordinates",
  async ({ latitude, longitude }, { rejectWithValue }) => {
    try {
      console.log("setMapMarkerCoordinates", latitude, longitude);

      return {
        latitude,
        longitude,
      };
    } catch (error) {
      return rejectWithValue("Помилка при визначенні локації.");
    }
  }
);

const mapSlice = createSlice({
  name: "map",
  initialState: {
    markerCoords: {
      latitude: 48.5336,
      longitude: 32.6369,
      latitudeDelta: 25,
      longitudeDelta: 25,
    },
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setMapMarkerCoordinates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setMapMarkerCoordinates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.markerCoords = { ...action.payload };
        console.log(state.markerCoords);
        state.error = null;
      })
      .addCase(setMapMarkerCoordinates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default mapSlice.reducer;
