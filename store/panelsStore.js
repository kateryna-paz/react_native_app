import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "./authStore";
import { ensureAuthenticated } from "./utils/authUtils";
import { getErrorMessage } from "./utils/errorHandler";
import { panelsApi } from "../services/apis/panels";
import { asyncStorage } from "../services/asyncStorageService";

const usePanelsStore = create(
  persist(
    (set, _) => ({
      panels: null,
      isLoading: false,
      error: null,
      registerPanel: { power: 0, number: 0, typeId: null },

      fetchPanels: async () => {
        set({ isLoading: true, error: null });

        try {
          const userId = ensureAuthenticated(useAuthStore.getState);
          const panels = await panelsApi.fetchUserPanels(userId);
          set({ panels, isLoading: false });
        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });
        }
      },

      changePanel: async ({ id, typeId, number, power }) => {
        set({ isLoading: true, error: null });

        try {
          const updatedPanel = await panelsApi.changePanel(
            id,
            typeId,
            number,
            power
          );
          set((state) => ({
            panels: state.panels.map((panel) =>
              panel.id === id ? { ...panel, ...updatedPanel } : panel
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });
        }
      },

      addPanel: async ({ typeId, number, power }) => {
        set({ isLoading: true, error: null });

        try {
          const userId = ensureAuthenticated(useAuthStore.getState);
          const newPanel = await panelsApi.addPanel(
            userId,
            typeId,
            number,
            power
          );

          set((state) => ({
            panels: [...state.panels, newPanel],
            registerPanel: { power: 0, number: 0, typeId: null },
            isLoading: false,
          }));
        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });
        }
      },

      deletePanel: async (id) => {
        set({ isLoading: true, error: null });

        try {
          await panelsApi.deletePanel(id);
          set((state) => ({
            panels: state.panels.filter((panel) => panel.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "panels-storage",
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

export default usePanelsStore;
