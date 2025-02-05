import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../utils/errorHandler";
import { devicesApi } from "../../services/apis/devices";

export const fetchDevices = createAsyncThunk(
  "devices/fetchDevices",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue(
          "Помилка при отриманні даних, користувач не визначений."
        );
      }

      return await devicesApi.fetchUserDevices(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addDevice = createAsyncThunk(
  "devices/addDevice",
  async ({ importance, name, power }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const userId = state.auth.user?.id;

      if (!userId) {
        return rejectWithValue(
          "Помилка при додаванні приладу, користувач не визначений."
        );
      }

      return await devicesApi.addDevice({ name, power, importance, userId });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateDevice = createAsyncThunk(
  "devices/updateDevice",
  async ({ id, name, power, importance }, { rejectWithValue }) => {
    try {
      return await devicesApi.updateDevice({ id, name, power, importance });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteDevice = createAsyncThunk(
  "devices/deleteDevice",
  async ({ id }, { rejectWithValue }) => {
    try {
      return await devicesApi.deleteDevice(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
const initialState = {
  devices: null,
  isLoading: false,
  error: null,
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    clearDevicesError: (state) => {
      state.error = null;
    },
    resetDevicesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch devices
      .addCase(fetchDevices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.devices = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // Add device
      .addCase(addDevice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // Update device
      .addCase(updateDevice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const updatedDevice = action.payload;
        const index = state.devices.findIndex(
          (device) => device.id === updatedDevice.id
        );
        if (index !== -1) {
          state.devices[index] = {
            ...state.devices[index],
            ...updatedDevice,
          };
        }
        state.isLoading = false;
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // Delete device
      .addCase(deleteDevice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter(
          (device) => device.id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { clearDevicesError, resetDevicesState } = devicesSlice.actions;
export default devicesSlice.reducer;
