import { create } from "zustand";
import useAuthStore from "./authStore";
import { asyncStorage } from "../services/asyncStorageService";
import { ensureAuthenticated } from "./utils/authUtils";
import { getErrorMessage } from "./utils/errorHandler";
import { devicesApi } from "../services/apis/devices";

const useDevicesStore = create(
  (set, _) => ({
    devices: null,
    isLoading: false,
    error: null,

    fetchDevices: async () => {
      try {
        set({ isLoading: true, error: null });

        const userId = ensureAuthenticated(useAuthStore.getState);

        const devices = await devicesApi.fetchUserDevices(userId);
        set({ devices, isLoading: false });
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    addDevice: async ({ importance, name, power }) => {
      try {
        set({ isLoading: true, error: null });

        const userId = ensureAuthenticated(useAuthStore.getState);

        const newDevice = await devicesApi.addDevice({
          name,
          power,
          importance,
          userId,
        });
        set((state) => ({
          devices: [...state.devices, newDevice],
          isLoading: false,
        }));
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    updateDevice: async ({ id, name, power, importance }) => {
      try {
        set({ isLoading: true, error: null });

        const updatedDevice = await devicesApi.updateDevice({
          id,
          name,
          power,
          importance,
        });

        set((state) => ({
          devices: state.devices.map((device) =>
            device.id === updatedDevice.id
              ? { ...device, ...updatedDevice }
              : device
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    deleteDevice: async (id) => {
      try {
        set({ isLoading: true, error: null });

        await devicesApi.deleteDevice(id);

        set((state) => ({
          devices: state.devices.filter((device) => device.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({ error: getErrorMessage(error), isLoading: false });
      }
    },

    clearDevicesError: () => set({ error: null }),
    resetDevicesState: () =>
      set({ devices: null, isLoading: false, error: null }),
  }),
  {
    name: "devices-storage",
    storage: {
      getItem: async (name) => {
        const data = await asyncStorage.getData(name);
        return data ? JSON.parse(data) : null;
      },
      setItem: async (name, value) => {
        await asyncStorage.setData(name, JSON.stringify(value));
      },
      removeItem: async (name) => {
        await asyncStorage.removeData(name);
      },
    },
  }
);

export default useDevicesStore;
