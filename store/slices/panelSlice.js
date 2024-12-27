import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

const initialState = {
  panels: null,
  registerPanel: {
    power: 0,
    number: 0,
    typeId: null,
  },
  isLoading: false,
  error: null,
};

export const fetchPanels = createAsyncThunk(
  "panels/fetchPanels",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue(
          "Помилка при отриманні даних, користувач не визначений."
        );
      }
      const response = await axiosInstance.get(`/panels/userId/${userId}`);

      if (!response) {
        return null;
      }

      const transformedData = response.data.map((panel) => ({
        id: panel.id,
        typeId: panel.typeId.id,
        type: panel.typeId.type,
        efficiency: panel.typeId.efficiency,
        power: panel.power,
        number: panel.number,
        userId: panel.userId,
      }));

      return transformedData;
    } catch (error) {
      return rejectWithValue("Помилка при отриманні даних: " + error);
    }
  }
);

export const changePanel = createAsyncThunk(
  "panels/changePanel",
  async ({ id, typeId, number, power }, { rejectWithValue }) => {
    try {
      const updatedPanel = await axiosInstance.put(`/panels/${id}`, {
        typeId,
        number,
        power,
      });

      return updatedPanel.data;
    } catch (error) {
      return rejectWithValue(
        "Помилка при оновленні даних про панель. " + error
      );
    }
  }
);

export const addPanel = createAsyncThunk(
  "panels/addPanel",
  async ({ typeId, number, power }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue(
          "Помилка при додаванні нової панелі, користувач не визначений."
        );
      }

      const newPanel = await axiosInstance.post("/panels", {
        typeId,
        number,
        power,
        userId,
      });

      const transformedData = {
        id: newPanel.data.id,
        typeId: newPanel.data.typeId.id,
        type: newPanel.data.typeId.type,
        efficiency: newPanel.data.typeId.efficiency,
        power: newPanel.data.power,
        number: newPanel.data.number,
        userId: newPanel.data.userId,
      };


      return transformedData;
    } catch (error) {
      return rejectWithValue(
        "Помилка при додаванні нової панелі " + error?.message
      );
    }
  }
);

export const deletePanel = createAsyncThunk(
  "panels/deletePanel",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/panels/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue("Помилка при видаленні панелі " + error);
    }
  }
);

const panelSlice = createSlice({
  name: "panels",
  initialState,
  reducers: {
    setRegisterPanel: (state, action) => {
      state.registerPanel = action.payload;
    },
  },
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

export const { setRegisterPanel } = panelSlice.actions;
export default panelSlice.reducer;
