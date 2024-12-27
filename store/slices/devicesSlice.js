import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

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

      const response = await axiosInstance.get(`/appliances/userId/${userId}`);

      if (!response) {
        return null;
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        "Сталася помилка при отримані даних про ваші прилади." + error
      );
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

      const response = await axiosInstance.post("/appliances", {
        name,
        power,
        importance,
        userId,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        "Сталася помилка при додаванні приладу." + error?.message
      );
    }
  }
);

export const updateDevice = createAsyncThunk(
  "devices/updateDevice",
  async ({ id, name, power, importance }, { rejectWithValue }) => {
    console.log(
      "id: " +
        id +
        " name: " +
        name +
        " power: " +
        power +
        " importance: " +
        importance
    );
    try {
      const updatedDevice = await axiosInstance.put(`/appliances/${id}`, {
        name,
        power,
        importance,
      });

      return updatedDevice.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        "Сталася помилка при оновленні приладу. " + error?.message || error
      );
    }
  }
);

export const deleteDevice = createAsyncThunk(
  "devices/deleteDevice",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/appliances/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        "Сталася помилка при видаленні приладу." + error?.message
      );
    }
  }
);

const devicesSlice = createSlice({
  name: "devices",
  initialState: {
    devices: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.devices = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(addDevice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addDevice.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(updateDevice.pending, (state, action) => {
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
        state.error = null;
      })
      .addCase(updateDevice.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(deleteDevice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        state.devices = state.devices.filter(
          (device) => device.id !== action.payload
        );
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default devicesSlice.reducer;
