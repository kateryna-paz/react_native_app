import { create } from "zustand";
import { asyncStorage } from "../services/asyncStorageService";
import { calculateDistribution } from "../utils/distributionUtils";

const STORAGE_KEY = "distribute-devices-storage";

const saveState = async (state) => {
  try {
    const dataToSave = {
      selectedDevices: state.selectedDevices,
      unselectedDevices: state.unselectedDevices,
      totalDistributeEnergy: state.totalDistributeEnergy,
    };
    await asyncStorage.setData(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error("Error saving state:", error);
  }
};

const initializeState = async () => {
  try {
    const storedData = await asyncStorage.getData(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return {
        ...parsedData,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error loading stored data:", error);
  }
  return {
    selectedDevices: [],
    unselectedDevices: [],
    totalDistributeEnergy: 0,
    isLoading: false,
    error: null,
  };
};

const useDistributeDevicesStore = create((set, get) => ({
  selectedDevices: [],
  unselectedDevices: [],
  totalDistributeEnergy: 0,
  isLoading: false,
  error: null,

  initializeStore: async () => {
    const initialState = await initializeState();
    set(initialState);
  },

  setTotalDistributeEnergy: async (energy) => {
    set({ totalDistributeEnergy: energy });
    await saveState(get());
  },

  clearDistributionState: async () => {
    const newState = {
      selectedDevices: [],
      unselectedDevices: [],
      totalDistributeEnergy: 0,
    };
    set(newState);
    await saveState(newState);
  },

  setSelectedDevices: async (devices) => {
    set({ selectedDevices: devices });
    await saveState(get());
  },

  setUnselectedDevices: async (devices) => {
    set({ unselectedDevices: devices });
    await saveState(get());
  },

  toggleSelectDevice: async (device) => {
    const state = get();
    const deviceId = device.id;
    const isSelected = state.selectedDevices.some((dev) => dev.id === deviceId);
    const deviceWithFixedTime = { ...device, fixedTime: false };

    let newState;
    if (isSelected) {
      newState = {
        selectedDevices: state.selectedDevices.filter(
          (dev) => dev.id !== deviceId
        ),
        unselectedDevices: state.unselectedDevices.some(
          (dev) => dev.id === deviceId
        )
          ? state.unselectedDevices
          : [...state.unselectedDevices, deviceWithFixedTime],
      };
    } else {
      newState = {
        unselectedDevices: state.unselectedDevices.filter(
          (dev) => dev.id !== deviceId
        ),
        selectedDevices: state.selectedDevices.some(
          (dev) => dev.id === deviceId
        )
          ? state.selectedDevices
          : [...state.selectedDevices, deviceWithFixedTime],
      };
    }

    set(newState);
    await saveState({ ...get(), ...newState });
  },

  setDeviceWorkingTime: async (deviceId, hours, minutes) => {
    try {
      set({ isLoading: true, error: null });
      const state = get();

      const device = state.selectedDevices.find((dev) => dev.id === deviceId);
      if (!device) {
        throw new Error("Device not found");
      }

      const updatedDevices = state.selectedDevices.map((dev) =>
        dev.id === deviceId
          ? {
              ...dev,
              workingHours: hours,
              workingMinutes: minutes,
              fixedTime: true,
            }
          : dev
      );

      const newDistribution = calculateDistribution(
        updatedDevices,
        state.totalDistributeEnergy
      );

      const newState = {
        selectedDevices: newDistribution,
        isLoading: false,
      };

      set(newState);
      await saveState({ ...get(), ...newState });

      return newDistribution;
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

useDistributeDevicesStore.getState().initializeStore();

export default useDistributeDevicesStore;
