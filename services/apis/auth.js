import axiosInstance from "../axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authApi = {
  checkExistingEmail: async (email) => {
    const response = await axiosInstance.get(`/users/email/${email}`);
    return response.data;
  },

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
    const user = await AsyncStorage.getItem("user");
    const token = await AsyncStorage.getItem("token");
    return { user: user ? JSON.parse(user) : null, token };
  },

  saveUserData: async (user, token) => {
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(user)],
      ["token", token],
    ]);
  },

  clearUserData: async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
  },
};

export default authApi;
