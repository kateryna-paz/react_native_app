import { asyncStorage } from "../asyncStorageService";
import axiosInstance from "../axiosConfig";

const authApi = {
  register: async (userData) => {
    const response = await axiosInstance.post("/users/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  },

  setAuthToken: (token) => {
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
  },

  removeAuthToken: () => {
    delete axiosInstance.defaults.headers.Authorization;
  },

  getUserData: async () => {
    const user = await asyncStorage.getData("user");
    const token = await asyncStorage.getData("token");

    if (token) {
      authApi.setAuthToken(token);
    }

    return { user: user ? JSON.parse(user) : null, token };
  },

  saveUserData: async (user, token) => {
    await asyncStorage.setData("user", JSON.stringify(user));
    await asyncStorage.setData("token", token);
  },

  clearUserData: async () => {
    await asyncStorage.removeData("distribute-devices-storage");
    await asyncStorage.removeData("user");
    await asyncStorage.removeData("token");
  },
};

export default authApi;
