import { create } from "zustand";
import { persist } from "zustand/middleware";
import authApi from "../services/apis/auth";
import { asyncStorage } from "../services/asyncStorageService";
import { getErrorMessage } from "./utils/errorHandler";

const useAuthStore = create(
  persist(
    (set, _) => ({
      user: null,
      userToken: null,
      isLoggedIn: false,
      isLoading: false,
      error: null,

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const { user, token } = await authApi.getUserData();
          if (token) {
            authApi.setAuthToken(token);
            set({ user, userToken: token, isLoggedIn: true });
          }
        } catch (error) {
          set({ user: null, userToken: null, isLoggedIn: false });
        } finally {
          set({ isLoading: false });
        }
      },

      registerUser: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          if (!name || !email || !password) {
            throw new Error(
              "Перевірте чи було введено ім'я, електронну пошту та пароль."
            );
          }
          const data = await authApi.register({ name, email, password });
          await authApi.saveUserData(data.user, data.token);
          authApi.setAuthToken(data.token);
          set({ user: data.user, userToken: data.token, isLoggedIn: true });
        } catch (error) {
          const err = getErrorMessage(error);
          set({ error: err });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      loginUser: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login({ email, password });
          await authApi.saveUserData(data.user, data.token);
          authApi.setAuthToken(data.token);

          set({ user: data.user, userToken: data.token, isLoggedIn: true });
        } catch (error) {
          const err = getErrorMessage(error);
          set({ error: err });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      logoutUser: async () => {
        try {
          await authApi.clearUserData();
          authApi.removeAuthToken();
          set({ user: null, userToken: null, isLoggedIn: false });
        } catch (error) {
          set({ error: "Помилка виходу з акаунту" });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
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

export default useAuthStore;
