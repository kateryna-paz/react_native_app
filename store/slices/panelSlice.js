import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../utils/errorHandler";
import { ensureAuthenticated } from "../utils/authUtils";
import { panelsApi } from "../../services/apis/panels";

export const fetchPanels = createAsyncThunk(
  "panels/fetchPanels",
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = ensureAuthenticated(getState);
      const panels = await panelsApi.fetchUserPanels(userId);

      return panels;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const changePanel = createAsyncThunk(
  "panels/changePanel",
  async ({ id, typeId, number, power }, { rejectWithValue }) => {
    try {
      const updatedPanel = await panelsApi.changePanel(
        id,
        typeId,
        number,
        power
      );

      return updatedPanel;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addPanel = createAsyncThunk(
  "panels/addPanel",
  async ({ typeId, number, power }, { rejectWithValue, getState }) => {
    try {
      const userId = ensureAuthenticated(getState);

      const newPanel = await panelsApi.addPanel(userId, typeId, number, power);

      return newPanel;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deletePanel = createAsyncThunk(
  "panels/deletePanel",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await panelsApi.deletePanel(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState = {
  panels: null,
  isLoading: false,
  error: null,
};

const panelSlice = createSlice({
  name: "panels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePanel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePanel.fulfilled, (state, action) => {
        const updatedPanel = action.payload;
        const index = state.panels.findIndex(
          (panel) => panel.id === updatedPanel.id
        );
        if (index !== -1) {
          state.panels[index] = {
            ...state.panels[index],
            ...updatedPanel,
          };
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePanel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPanels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPanels.fulfilled, (state, action) => {
        state.panels = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchPanels.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(deletePanel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePanel.fulfilled, (state, action) => {
        state.panels = state.panels.filter(
          (panel) => panel.id !== action.payload
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deletePanel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPanel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addPanel.fulfilled, (state, action) => {
        const newPanel = {
          id: action.payload.id,
          typeId: action.payload.typeId,
          type: action.payload.type,
          power: action.payload.power,
          number: action.payload.number,
        };
        state.registerPanel = {
          power: 0,
          number: 0,
          typeId: null,
        };
        state.panels.push(newPanel);
        state.isLoading = false;
      })
      .addCase(addPanel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default panelSlice.reducer;
