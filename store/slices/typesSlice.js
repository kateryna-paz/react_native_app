import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { panelTypesApi } from "../../services/apis/panelTypes";
import { getErrorMessage } from "../utils/errorHandler";

export const fetchPanelTypes = createAsyncThunk(
  "panelTypes/fetchPanelTypes",
  async (_, { rejectWithValue }) => {
    try {
      const types = await panelTypesApi.fetchTypes();

      return types;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  panelTypes: null,
  isTypesLoading: false,
  errorTypes: null,
};

const typesSlice = createSlice({
  name: "panelTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanelTypes.pending, (state) => {
        state.isTypesLoading = true;
        state.errorTypes = null;
      })
      .addCase(fetchPanelTypes.fulfilled, (state, action) => {
        state.panelTypes = action.payload;
        state.isTypesLoading = false;
        state.errorTypes = null;
      })
      .addCase(fetchPanelTypes.rejected, (state, action) => {
        state.errorTypes = action.payload;
        state.isTypesLoading = false;
      });
  },
});

export default typesSlice.reducer;
