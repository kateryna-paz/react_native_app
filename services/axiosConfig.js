import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL + process.env.EXPO_PUBLIC_API_URL,
});

const getAuthToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token ? `Bearer ${token}` : null;
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
      try {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refreshToken");

        const navigation = useNavigation();
        navigation.navigate("/auth/login");
      } catch (logoutError) {
        console.error("Error during logout:", logoutError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
