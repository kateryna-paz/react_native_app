import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

const initialState = {
  panelTypes: null,
  isTypesLoaded: false,
  errorTypes: null,
};

export const fetchPanelTypes = createAsyncThunk(
  "panelTypes/fetchPanelTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/paneltypes");

      return response.data;
    } catch (error) {
      return rejectWithValue("Помилка при отриманні даних" + error);
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
        state.isTypesLoaded = false;
        state.errorTypes = null;
      })
      .addCase(fetchPanelTypes.fulfilled, (state, action) => {
        state.panelTypes = action.payload;
        state.isTypesLoaded = true;
        state.errorTypes = null;
      })
      .addCase(fetchPanelTypes.rejected, (state, action) => {
        state.errorTypes = action.payload;
        state.isTypesLoaded = false;
      });
  },
});

export default typesSlice.reducer;
