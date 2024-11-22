import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

const initialState = {
  panelTypes: null,
  isLoaded: false,
  error: null,
};

export const fetchPanelTypes = createAsyncThunk(
  "panelTypes/fetchPanelTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/paneltypes");
      
      return response.data;
    } catch (error) {
      return rejectWithValue("Помилка при отриманні даних");
    }
  }
);

const typesSlice = createSlice({
  name: "panelTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanelTypes.pending, (state) => {
        state.isLoaded = false;
        state.error = null;
      })
      .addCase(fetchPanelTypes.fulfilled, (state, action) => {
        state.panelTypes = action.payload;
        state.isLoaded = true;
        state.error = null;
      })
      .addCase(fetchPanelTypes.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoaded = false;
      });
  },
});

export default typesSlice.reducer;
