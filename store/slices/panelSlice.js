import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

const initialState = {
  panels: [],
  isLoaded: false,
  error: null,
};

export const fetchPanels = createAsyncThunk(
  "panels/fetchPanels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/panels");

      const transformedData = response.data.map((panel) => ({
        id: panel.id,
        typeId: panel.typeId.id,
        type: panel.typeId.type,
        square: panel.square,
        number: panel.number,
      }));

      return transformedData;
    } catch (error) {
      return rejectWithValue("Помилка при отриманні даних" + error);
    }
  }
);

const updatePanelOnServer = async ({ id, typeId, number, square }) => {
  const response = await axiosInstance.put(`/panels/${id}`, {
    typeId,
    number,
    square,
  });
  return response.data;
};

export const changePanel = createAsyncThunk(
  "panels/changePanel",
  async ({ id, typeId, number, square }, { rejectWithValue }) => {
    try {
      const updatedPanel = await updatePanelOnServer({
        id,
        typeId,
        number,
        square,
      });
      return updatedPanel;
    } catch (error) {
      return rejectWithValue("Помилка при оновленні даних про панель" + error);
    }
  }
);

export const addPanel = createAsyncThunk(
  "panels/addPanel",
  async ({ typeId, number, square }, { rejectWithValue }) => {
    try {
      const newPanelId = await axiosInstance.post("/panels", {
        typeId,
        number,
        square,
      });

      const panel = await axiosInstance.get(`/panels/${newPanelId.data}`);

      return panel.data;
    } catch (error) {
      return rejectWithValue("Помилка при додаванні нової панелі");
    }
  }
);

export const deletePanel = createAsyncThunk(
  "panels/deletePanel",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/panels/${id}`);
      console.log(id);
      return id;
    } catch (error) {
      return rejectWithValue("Помилка при видаленні панелі" + error);
    }
  }
);

const panelSlice = createSlice({
  name: "panels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(changePanel.pending, (state) => {
        state.isLoaded = false;
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
        state.isLoaded = true;
        state.error = null;
      })
      .addCase(changePanel.rejected, (state, action) => {
        state.isLoaded = true;
        state.error = action.payload;
      })
      .addCase(fetchPanels.pending, (state) => {
        state.isLoaded = false;
        state.error = null;
      })
      .addCase(fetchPanels.fulfilled, (state, action) => {
        state.panels = action.payload;
        state.isLoaded = true;
        state.error = null;
      })
      .addCase(fetchPanels.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoaded = false;
      })
      .addCase(deletePanel.pending, (state) => {
        state.isLoaded = false;
        state.error = null;
      })
      .addCase(deletePanel.fulfilled, (state, action) => {
        state.panels = state.panels.filter(
          (panel) => panel.id !== action.payload
        );
        state.isLoaded = true;
        state.error = null;
      })
      .addCase(deletePanel.rejected, (state, action) => {
        state.isLoaded = true;
        state.error = action.payload;
      })
      .addCase(addPanel.pending, (state) => {
        state.isLoaded = false;
        state.error = null;
      })
      .addCase(addPanel.fulfilled, (state, action) => {
        state.error = null;
        const newPanel = {
          id: action.payload.id,
          typeId: action.payload.typeId.id,
          type: action.payload.typeId.type,
          square: action.payload.square,
          number: action.payload.number,
        };
        state.panels.push(newPanel);
        state.isLoaded = true;
      })
      .addCase(addPanel.rejected, (state, action) => {
        state.isLoaded = true;
        state.error = action.payload;
      });
  },
});

export default panelSlice.reducer;
