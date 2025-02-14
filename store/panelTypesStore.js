import { create } from "zustand";
import { persist } from "zustand/middleware";
import { panelTypesApi } from "../services/apis/panelTypes";
import { getErrorMessage } from "./utils/errorHandler";
import { asyncStorage } from "../services/asyncStorageService";

const usePanelTypesStore = create(
  persist(
    (set) => ({
      panelTypes: null,
      isTypesLoading: false,
      errorTypes: null,

      fetchPanelTypes: async () => {
        set({ isTypesLoading: true, errorTypes: null });

        try {
          const types = await panelTypesApi.fetchTypes();
          set({ panelTypes: types, isTypesLoading: false });
        } catch (error) {
          set({ errorTypes: getErrorMessage(error), isTypesLoading: false });
        }
      },

      clearError: () => set({ errorTypes: null }),
    }),
    {
      name: "panelTypes-storage",
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
  )
);

export default usePanelTypesStore;
