import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDevices: [],
  unselectedDevices: [],
  totalDistributeEnergy: 0,
};

const distributeDevicesSlice = createSlice({
  name: "distributeDevices",
  initialState,
  reducers: {
    setTotalDistributeEnergy: (state, action) => {
      state.totalDistributeEnergy = action.payload;
    },
    setSelectedDevices: (state, action) => {
      state.selectedDevices = action.payload;
    },
    addSelectDevice: (state, action) => {
      state.selectedDevices.push(action.payload);
    },
    removeSelectDevice: (state, action) => {
      const index = state.selectedDevices.indexOf(action.payload);
      if (index !== -1) {
        state.selectedDevices.splice(index, 1);
      }
    },
  },
});

export const {
  setSelectedDevices,
  addSelectDevice,
  removeSelectDevice,
  setTotalDistributeEnergy,
} = distributeDevicesSlice.actions;
export default distributeDevicesSlice.reducer;
