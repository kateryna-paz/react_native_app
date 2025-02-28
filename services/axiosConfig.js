import axios from "axios";
import { asyncStorage } from "./asyncStorageService";

const listeners = new Set();

export const authEvents = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  emit: (event) => {
    listeners.forEach((listener) => listener(event));
  },
};

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL + process.env.EXPO_PUBLIC_API_URL,
});

const getAuthToken = async () => {
  const token = await asyncStorage.getData("token");
  return token ? `Bearer ${token}` : null;
};

const handleLogout = async () => {
  try {
    await asyncStorage.removeData("token");
    await asyncStorage.removeData("refreshToken");
    await asyncStorage.removeData("distribute-devices-storage");
    authEvents.emit("unauthorized");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await handleLogout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
